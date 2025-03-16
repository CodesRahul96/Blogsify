import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // State for navbar visibility
  const [lastScrollY, setLastScrollY] = useState(0); // Track last scroll position
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Scroll event handler to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down and past 50px - hide navbar
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY); // Update last scroll position
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/50 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-blue-900 to-gray-900 animate-gradient-bg opacity-70"></div>

      {/* Navbar Content */}
      <div className="relative z-10 mx-auto px-4 flex justify-between md:justify-around items-center py-4">
        <Link
          to="/"
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 font-inter"
        >
          Blogsify
        </Link>

        {/* Hamburger Menu Button */}
        <button
          className="md:hidden focus:outline-none text-white p-2 rounded-full hover:bg-gray-700/50 transition-all duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center font-merriweather">
          {!user ? (
            <Link
              to="/"
              className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
            >
              Home
            </Link>
          ) : null}
          <Link
            to="/blogs"
            className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
          >
            Blogs
          </Link>
          {user ? (
            <>
              {user.isAdmin && (
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
                >
                  Dashboard
                </Link>
              )}
              <span className="text-gray-400">
                Welcome, {user.username || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-purple-500 text-white px-3 py-1 rounded-full hover:from-red-600 hover:to-purple-600 transition-all duration-300 shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-300 hover:text-purple-400 transition-colors duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-6 py-6 px-4 pb-6 bg-gray-800/90 backdrop-blur-lg text-center border-t border-gray-700/50 font-merriweather">
          {!user ? (
            <Link
              to="/"
              className="block text-gray-300 hover:text-purple-400 transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          ) : null}
          <Link
            to="/blogs"
            className="block text-gray-300 hover:text-purple-400 transition-colors duration-300"
            onClick={() => setIsOpen(false)}
          >
            Blogs
          </Link>
          {user ? (
            <>
              {user.isAdmin && (
                <Link
                  to="/dashboard"
                  className="block text-gray-300 hover:text-purple-400 transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <span className="block text-gray-400">
                Welcome, {user.username || 'User'}
              </span>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-center bg-gradient-to-r from-red-500 to-purple-500 text-white px-3 py-1 rounded-full hover:from-red-600 hover:to-purple-600 transition-all duration-300 shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block text-gray-300 hover:text-purple-400 transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block text-gray-300 hover:text-purple-400 transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;