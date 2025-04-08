import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { FaFutbol, FaUserCircle, FaCoins, FaBars, FaSignOutAlt } from 'react-icons/fa';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-gradient-to-r from-primary to-blue-500 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <FaFutbol className="text-yellow-400 text-3xl mr-3" />
          <h1 className="text-2xl md:text-3xl font-title text-white">FUT DRAFT SPIN</h1>
        </div>
        
        {isAuthenticated ? (
          <>
            {/* Desktop view */}
            <div className="hidden md:flex items-center space-x-4">
              {user?.coins !== undefined && (
                <div className="flex items-center mr-2 bg-black/20 rounded-full px-3 py-1">
                  <FaCoins className="text-yellow-400 mr-1" />
                  <span className="text-white font-medium">{user.coins.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center">
                <span className="text-sm md:text-base text-white mr-2">
                  {user?.telegram_username || user?.username}
                </span>
                <Avatar className="h-10 w-10 bg-yellow-400 text-primary">
                  <AvatarFallback>
                    {user?.username ? getInitials(user.username) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            
            {/* Mobile menu trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white">
                  <FaBars size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-primary text-white">
                <div className="flex items-center space-x-2 mt-4 mb-6">
                  <Avatar className="h-12 w-12 bg-yellow-400 text-primary">
                    <AvatarFallback>
                      {user?.username ? getInitials(user.username) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{user?.telegram_username || user?.username}</h3>
                    <div className="flex items-center text-sm text-yellow-400">
                      <FaCoins className="mr-1" />
                      <span>{user?.coins?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-white/20" />
                
                <nav className="mt-6">
                  <ul className="space-y-4">
                    <li>
                      <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                        <a className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-blue-600 transition-colors">
                          <FaFutbol />
                          <span>Home</span>
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/spin" onClick={() => setMobileMenuOpen(false)}>
                        <a className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-blue-600 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v8" />
                            <path d="M8 12h8" />
                          </svg>
                          <span>Spin</span>
                        </a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/team-battle" onClick={() => setMobileMenuOpen(false)}>
                        <a className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-blue-600 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10z" />
                            <path d="M12 11V5" />
                            <path d="M12 11h5" />
                            <path d="M12 11h-5" />
                            <path d="M12 11v6" />
                          </svg>
                          <span>Team Battle</span>
                        </a>
                      </Link>
                    </li>
                    <li>
                      <button 
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-blue-600 transition-colors text-red-300"
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <FaUserCircle className="text-white text-2xl" />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
