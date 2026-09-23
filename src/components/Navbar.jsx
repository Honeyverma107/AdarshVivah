import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, User, ShieldCheck, Sparkles, LogOut, LayoutDashboard } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ isLoggedIn: propIsLoggedIn, onLogout: propOnLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const activeIsLoggedIn = isAuthenticated || propIsLoggedIn;

  const handleLogoutClick = () => {
    logout();
    if (propOnLogout) propOnLogout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About Us', path: '/about' },
    { name: 'Success Stories', path: '/success-stories' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-maroon-600 to-maroon-800 flex items-center justify-center text-white shadow-md shadow-maroon-900/10 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-gold-400 text-gold-400" />
            </div>
            <div>
              <span className="font-serif font-bold text-2xl tracking-tight text-maroon-700 block leading-tight">
                Adarsh<span className="text-gold-500">Vivah</span>
              </span>
              <span className="text-[10px] uppercase font-semibold text-muted-500 tracking-widest block -mt-1">
                Where Traditions Meet Timeless Connections
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-maroon-700 font-semibold border-b-2 border-maroon-600 pb-1'
                    : 'text-dark-700 hover:text-maroon-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden lg:flex items-center gap-3">
            {activeIsLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard" className="flex items-center gap-2 p-1.5 rounded-full hover:bg-rose-50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-maroon-700 text-white flex items-center justify-center font-bold text-sm border-2 border-gold-400">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-bold text-dark-800 max-w-[120px] truncate">{user?.email || 'User'}</p>
                    <p className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </p>
                  </div>
                </Link>
                
                <Link to="/dashboard">
                  <Button variant="secondary" size="sm" icon={LayoutDashboard}>
                    Dashboard
                  </Button>
                </Link>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon={LogOut}
                  onClick={handleLogoutClick}
                  title="Logout"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" icon={Sparkles}>
                    Create Account
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-dark-800 hover:bg-rose-50 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-rose-100 px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-rose-50 text-maroon-700 font-bold'
                  : 'text-dark-800 hover:bg-rose-50/50'
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-3 border-t border-rose-100 flex flex-col gap-2">
            {activeIsLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-maroon-600 text-white font-medium text-sm"
                >
                  My Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogoutClick();
                  }}
                  className="w-full text-center py-2 text-sm text-rose-700 font-medium hover:bg-rose-50 rounded-xl"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" fullWidth>
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" fullWidth>
                    Create Account
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
export default Navbar;
