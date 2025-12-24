import { useState, useContext, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Logo from "../../assets/lettering.png";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileButtonRef = useRef(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close User Dropdown if clicked outside
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }

      // Close Mobile Menu if clicked outside
      // We check if click is NOT on the menu AND NOT on the toggle button
      if (
        isOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        mobileButtonRef.current &&
        !mobileButtonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, menuOpen]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-4" : "py-6"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          scrolled ? "" : ""
        }`}
      >
        <div
          className={`relative flex items-center justify-between rounded-full border border-white/10 px-6 py-3 shadow-lg backdrop-blur-xl transition-all duration-300 ${
            scrolled ? "bg-black/40" : "bg-white/5"
          }`}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={Logo}
              alt="Blogsify"
              className="h-8 group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Center Menu */}
          <div className="hidden md:flex items-center gap-1 bg-black/20 rounded-full p-1 border border-white/5 backdrop-blur-md">
            {[
              { name: "Home", path: "/" },
              { name: "Blogs", path: "/blogs" },
              { name: "About", path: "/about" },
              { name: "Support", path: "/support" },
            ].map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-white text-black shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <img
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                      user.username || "User"
                    )}`}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full bg-black/20 shadow-lg"
                  />
                  <span className="hidden sm:block text-sm font-medium text-white/90">
                    {user.username}
                  </span>
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden py-2"
                    >
                      <div className="px-4 py-2 border-b border-white/5 mb-2">
                        <p className="text-white font-medium truncate">
                          {user.username}
                        </p>
                        <p className="text-white/40 text-xs truncate">
                          {user.email || "User"}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        Dashboard
                      </Link>
                      <div className="h-px bg-white/5 my-2" />
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="hidden sm:block text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              ref={mobileButtonRef}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden mt-2"
            >
              <div
                ref={mobileMenuRef}
                className="bg-[#1c1c1e]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-4 space-y-1"
              >
                {[
                  { name: "Home", path: "/" },
                  { name: "Blogs", path: "/blogs" },
                  { name: "About", path: "/about" },
                  { name: "Support", path: "/support" },
                ].map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-xl text-sm font-medium ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}

export default Navbar;
