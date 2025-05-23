import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { FiShoppingBag, FiUser, FiSun, FiMoon, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const { itemCount, toggleCart } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const navbarClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    scrolled ? 'py-3 bg-white/80 backdrop-blur-md shadow-md dark:bg-dark/80' : 'py-6'
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative z-10">
          <motion.div 
            className="text-2xl font-bold font-display text-gradient"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            LUXE
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link href={link.path} key={link.name}>
              <motion.span 
                className={`text-base font-medium hover:text-primary-500 transition-colors ${
                  router.pathname === link.path ? 'text-primary-500' : ''
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {link.name}
                {router.pathname === link.path && (
                  <motion.div
                    className="h-1 bg-primary-500 mt-1 rounded-full"
                    layoutId="navbar-indicator"
                  />
                )}
              </motion.span>
            </Link>
          ))}
        </div>

        {/* Cart, User, and Theme Icons */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            className="hidden md:flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </motion.button>

          {/* Cart Button */}
          <motion.button
            onClick={toggleCart}
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Open cart"
          >
            <FiShoppingBag className="h-6 w-6" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-500 text-xs text-white">
                {itemCount}
              </span>
            )}
          </motion.button>

          {/* User Menu */}
          <div className="hidden md:block relative">
            <motion.button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="User menu"
            >
              <FiUser className="h-5 w-5" />
            </motion.button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-700">
                          <p className="font-medium">{user?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                        </div>
                        <Link href="/account" onClick={() => setShowUserMenu(false)}>
                          <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                            My Account
                          </span>
                        </Link>
                        <Link href="/orders" onClick={() => setShowUserMenu(false)}>
                          <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                            Orders
                          </span>
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            router.reload();
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                          role="menuitem"
                        >
                          <FiLogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/login" onClick={() => setShowUserMenu(false)}>
                          <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                            Sign in
                          </span>
                        </Link>
                        <Link href="/register" onClick={() => setShowUserMenu(false)}>
                          <span className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem">
                            Create account
                          </span>
                        </Link>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center p-2 rounded-md"
            >
              <svg
                className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-dark/95 backdrop-blur-md shadow-lg"
          >
            <div className="container-custom py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link href={link.path} key={link.name} onClick={() => setIsOpen(false)}>
                  <motion.span
                    className={`block py-2 text-lg font-medium ${
                      router.pathname === link.path ? 'text-primary-500' : ''
                    }`}
                    whileHover={{ x: 5 }}
                  >
                    {link.name}
                  </motion.span>
                </Link>
              ))}
              
              {/* Mobile User Menu */}
              <div className="pt-4 mt-4 border-t dark:border-gray-700">
                {isAuthenticated ? (
                  <>
                    <div className="mb-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as</p>
                      <p className="font-medium">{user?.name}</p>
                    </div>
                    <Link href="/account" onClick={() => setIsOpen(false)}>
                      <motion.span className="block py-2 text-lg font-medium" whileHover={{ x: 5 }}>
                        My Account
                      </motion.span>
                    </Link>
                    <Link href="/orders" onClick={() => setIsOpen(false)}>
                      <motion.span className="block py-2 text-lg font-medium" whileHover={{ x: 5 }}>
                        Orders
                      </motion.span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        router.reload();
                      }}
                      className="flex items-center py-2 text-lg font-medium text-red-600 dark:text-red-400"
                    >
                      <FiLogOut className="mr-2 h-5 w-5" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <motion.span className="block py-2 text-lg font-medium" whileHover={{ x: 5 }}>
                        Sign in
                      </motion.span>
                    </Link>
                    <Link href="/register" onClick={() => setIsOpen(false)}>
                      <motion.span className="block py-2 text-lg font-medium" whileHover={{ x: 5 }}>
                        Create account
                      </motion.span>
                    </Link>
                  </>
                )}
                
                {/* Mobile Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="flex items-center py-2 text-lg font-medium"
                >
                  {theme === 'dark' ? (
                    <>
                      <FiSun className="mr-2 h-5 w-5" />
                      Light Mode
                    </>
                  ) : (
                    <>
                      <FiMoon className="mr-2 h-5 w-5" />
                      Dark Mode
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
