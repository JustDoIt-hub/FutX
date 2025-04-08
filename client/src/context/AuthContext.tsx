import { createContext, useState, ReactNode } from 'react';

// Simplified user interface
interface User {
  id: number;
  username: string;
  coins: number;
}

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
}

// Default guest user - always authenticated
const DEFAULT_USER: User = {
  id: 1,
  username: 'guest',
  coins: 10000
};

export const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_USER,
  isAuthenticated: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Always use the default user, no auth needed
  const [user] = useState<User>(DEFAULT_USER);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};