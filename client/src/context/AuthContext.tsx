import { createContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  username: string;
  telegram_id?: string;
  telegram_username?: string;
  coins: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (code: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false, // Set this to false by default
  isAuthenticated: false,
  login: async () => false,
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Start with false to avoid being stuck loading
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        console.log("Checking authentication status...");
        
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/auth/me');
        xhr.withCredentials = true;
        
        xhr.onload = () => {
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.responseText);
              console.log("User authenticated:", data.user);
              setUser(data.user);
            } catch (err) {
              console.error('Error parsing auth response:', err);
              setUser(null);
            }
          } else {
            console.log("User not authenticated");
            setUser(null);
          }
          
          console.log("Auth check complete, setting isLoading to false");
          setIsLoading(false);
        };
        
        xhr.onerror = () => {
          console.error('Network error during auth check');
          setUser(null);
          setIsLoading(false);
        };
        
        xhr.send();
      } catch (error) {
        console.error('Failed to check auth status:', error);
        setUser(null);
        setIsLoading(false);
      }
    };

    // Small delay to ensure everything is initialized
    const timer = setTimeout(() => {
      checkAuthStatus();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Login with Telegram code
  const login = async (code: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log(`Attempting to login with code: ${code}`);
      
      // Use XMLHttpRequest instead of fetch to ensure cookies are handled properly
      const loginPromise = new Promise<{user: any}>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/auth/telegram');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.withCredentials = true;
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              console.log('Login response:', data);
              resolve(data);
            } catch (err) {
              console.error('Error parsing response:', err);
              reject(new Error('Invalid response format'));
            }
          } else {
            console.error('Login failed with status:', xhr.status);
            reject(new Error(xhr.responseText || 'Authentication failed'));
          }
        };
        
        xhr.onerror = () => {
          console.error('Network error during login');
          reject(new Error('Network error during login'));
        };
        
        xhr.send(JSON.stringify({ code }));
      });
      
      const data = await loginPromise;
      console.log('Setting user to:', data.user);
      setUser(data.user);
      
      toast({
        title: 'Login successful',
        description: 'Welcome to FUT Draft Spin!',
      });
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const logoutPromise = new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/auth/logout');
        xhr.withCredentials = true;
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log('Logout successful');
            resolve();
          } else {
            console.error('Logout failed with status:', xhr.status);
            reject(new Error('Logout failed'));
          }
        };
        
        xhr.onerror = () => {
          console.error('Network error during logout');
          reject(new Error('Network error during logout'));
        };
        
        xhr.send();
      });
      
      await logoutPromise;
      setUser(null);
      
      toast({
        title: 'Logout successful',
        description: 'You have been logged out',
      });
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: 'Logout failed',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
