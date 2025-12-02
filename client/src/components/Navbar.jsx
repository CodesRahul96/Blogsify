import 'react';
import { useState, useContext, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Logo from "../assets/lettering.png"

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // State for navbar visibility
  const [lastScrollY, setLastScrollY] = useState(0); // Track last scroll position
  const [menuOpen, setMenuOpen] = useState(false); // user dropdown
  const menuRef = useRef(null);
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

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [menuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-gradient-to-r from-black/60 via-gray-900/60 to-black/60 backdrop-blur-lg border-b border-gray-700/50 z-50 transition-transform duration-300 shadow-lg ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="relative z-10 mx-auto px-4 flex justify-between md:justify-between items-center py-3 max-w-6xl">
        <Link to="/" className="flex items-center gap-3">
          <img src={Logo} alt="Blogsify" className="h-10" />
          {/* <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 font-semibold text-lg">Blogsify</span> */}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 font-merriweather text-sm">
          {!user && (
            <NavLink to="/" className={({isActive}) => isActive ? 'text-purple-300 font-semibold transition' : 'text-gray-300 hover:text-purple-300 transition-colors duration-200'}>Home</NavLink>
          )}
          <NavLink to="/blogs" className={({isActive}) => isActive ? 'text-purple-300 font-semibold transition' : 'text-gray-300 hover:text-purple-300 transition-colors duration-200'}>Blogs</NavLink>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Auth buttons / user menu - Desktop only */}
          {user ? (
            <div className="relative hidden md:block" ref={menuRef}>
              <button onClick={() => setMenuOpen(s => !s)} aria-haspopup="true" aria-expanded={menuOpen} className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-200">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold text-white">{(user.username || 'U').charAt(0).toUpperCase()}</div>
                <span className="hidden sm:inline text-sm font-medium">{user.username}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-700/50 py-2 text-sm z-10 animate-in fade-in-up duration-200">
                  <Link to="/profile" className="block px-4 py-2 text-gray-200 hover:bg-purple-600/30 hover:text-white transition-colors duration-200">Profile</Link>
                  <Link to="/dashboard" className="block px-4 py-2 text-gray-200 hover:bg-purple-600/30 hover:text-white transition-colors duration-200">Dashboard</Link>
                  <hr className="my-1 border-gray-700/30" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-colors duration-200">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-gray-300 hover:text-purple-300 transition-colors duration-200 text-sm">Login</Link>
              <Link to="/register" className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm font-medium">Sign Up</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button className="md:hidden focus:outline-none text-white p-2 rounded-full hover:bg-gray-700/50 transition-all duration-300" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="mt-0 space-y-2 py-4 px-4 bg-gray-800/95 backdrop-blur-lg text-center border-t border-gray-700/50 font-merriweather text-sm">
          {!user && (
            <Link to="/" className="block text-gray-300 hover:text-purple-300 hover:bg-purple-600/10 py-2 rounded transition-all duration-200" onClick={() => setIsOpen(false)}>Home</Link>
          )}
          <Link to="/blogs" className="block text-gray-300 hover:text-purple-300 hover:bg-purple-600/10 py-2 rounded transition-all duration-200" onClick={() => setIsOpen(false)}>Blogs</Link>
              {user ? (
            <>
              <Link to="/profile" className="block text-gray-300 hover:text-purple-300 hover:bg-purple-600/10 py-2 rounded transition-all duration-200" onClick={() => setIsOpen(false)}>Profile</Link>
              <Link to="/dashboard" className="block text-gray-300 hover:text-purple-300 hover:bg-purple-600/10 py-2 rounded transition-all duration-200" onClick={() => setIsOpen(false)}>Dashboard</Link>
              <div className="block text-gray-400 py-2">Welcome, {user.username || 'User'}</div>
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-center bg-gradient-to-r from-red-500 to-purple-500 text-white px-3 py-2 rounded-full hover:from-red-600 hover:to-purple-600 transition-all duration-200 shadow-md font-medium text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-300 hover:text-purple-300 hover:bg-purple-600/10 py-2 rounded transition-all duration-200" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-2 rounded-full shadow-md hover:from-purple-700 hover:to-blue-700 transition mx-auto w-32 font-medium text-sm" onClick={() => setIsOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;