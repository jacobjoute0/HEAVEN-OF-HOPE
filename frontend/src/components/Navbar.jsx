import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Academics', path: '/academics' },
  { name: 'Admissions', path: '/admissions' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Admin Login', path: '/admin/login' },
  { name: 'Parent Login   ',path: '/parent/login'},
  { name: 'Teacher Login', path:'/teacherlogin'},
  { name: 'Student Login', path:'/student/login'},

  // { name: 'Contact', path: '/contact' },
  // { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-green-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
          
            <div>
               <img 
  src={logo} 
  alt="Logo" 
  className="h-16 w-16 rounded-full object-cover border-2 border-green-300"
/>
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-lg leading-tight">Haven of Hope Academy</p>
              <p className="text-green-300 text-xs italic">Learning Today, Leading Tomorrow</p>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.path
                    ? 'bg-green-600 text-white'
                    : 'text-green-100 hover:bg-green-700 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              className="ml-3 px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-md text-sm font-medium transition-colors duration-200"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md text-green-100 hover:text-white hover:bg-green-700 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-green-900 border-t border-green-700"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    location.pathname === link.path
                      ? 'bg-green-600 text-white'
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 bg-green-500 hover:bg-green-400 text-white rounded-md text-sm font-medium transition-colors duration-200"
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
