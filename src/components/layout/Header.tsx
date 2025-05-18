import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Navigation links
  const navLinks = [
    { title: 'الرئيسية', path: '/' },
    { title: 'المشاريع', path: '/projects' },
    { title: 'الخدمات', path: '/services' },
    { title: 'المهارات', path: '/skills' },
    { title: 'السيرة الذاتية', path: '/cv' },
    // { title: 'اتصل بي', path: '/contact' },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white shadow-md py-2'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold text-blue-600"
            >
              <span className="text-3xl">MSM</span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 space-x-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${location.pathname === link.path
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
                  }`}
                onClick={closeMenu}
              >
                {link.title}
              </Link>
            ))}

            {user ? (
              <div className="relative group mr-4">
                <button className="flex items-center px-4 py-2 rounded-md font-medium text-gray-700 hover:text-blue-600">
                  <User size={18} className="ml-2" />
                  حسابي
                  <ChevronDown size={16} className="mr-1" />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden transform scale-0 group-hover:scale-100 transition-transform origin-top-left z-50">
                  <Link to="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-blue-50">
                    لوحة التحكم
                  </Link>
                  <button
                    onClick={signOut}
                    className="flex items-center w-full text-right px-4 py-2 text-gray-700 hover:bg-blue-50"
                  >
                    <LogOut size={16} className="ml-2" />
                    تسجيل الخروج
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                  to="/contact"
                className="mr-4 px-2 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                اتصل بي
                </Link>
               
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white shadow-lg"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md font-medium ${location.pathname === link.path
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
                onClick={closeMenu}
              >
                {link.title}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100"
                  onClick={closeMenu}
                >
                  لوحة التحكم
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    closeMenu();
                  }}
                  className="flex items-center px-4 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100"
                >
                  <LogOut size={16} className="ml-2" />
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <Link hidden
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                onClick={closeMenu}
              >
                تسجيل الدخول
              </Link>
            )}
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;