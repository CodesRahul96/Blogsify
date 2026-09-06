import { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Logo from "../../assets/lettering.png";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "../ui/ThemeToggle";
import {
  FiSearch,
  FiEdit3,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";

const CATEGORIES = [
  { label: "All Stories", value: "All" },
  { label: "Technology", value: "Technology" },
  { label: "Artificial Intelligence", value: "Artificial Intelligence" },
  { label: "Cybersecurity", value: "Cybersecurity" },
  { label: "Design", value: "Design" },
  { label: "Startups", value: "Startups" },
  { label: "Engineering", value: "Engineering" },
  { label: "Culture", value: "Culture" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef(null);
  const { user, logout } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 transition-colors duration-200">
      {/* Top Utility Bar */}
      <div className="hidden lg:block border-b border-zinc-200 dark:border-zinc-800/50 py-1.5 px-6 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-medium tracking-wide text-zinc-700 dark:text-zinc-300">
              {currentDate}
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[10px]">
                Edition
              </span>
              <span>Global Dispatch • Modern Publication</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <Link
              to="/guidelines"
              className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              Writing Standards
            </Link>
            <Link to="/about" className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors">
              About The Journal
            </Link>
            <Link
              to="/support"
              className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              Support & Ethics
            </Link>
          </div>
        </div>
      </div>

      {/* Main Masthead Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile Menu & Brand Left */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              aria-label="Toggle navigation"
            >
              {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            {/* Publication Masthead Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={Logo}
                alt="Blogsify"
                className="h-7 sm:h-9 object-contain filter contrast-125 dark:brightness-100 invert dark:invert-0"
              />
              <span className="hidden sm:inline-block pl-3 border-l border-zinc-300 dark:border-zinc-700/60 text-[11px] font-serif uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                The Journal of Modern Ideas
              </span>
            </Link>
          </div>

          {/* Center Search Input (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative w-72 lg:w-96"
          >
            <FiSearch className="absolute left-3.5 text-zinc-400 dark:text-zinc-500" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories, topics, authors..."
              className="w-full bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-300 dark:border-zinc-800 rounded-full pl-9 pr-4 py-1.5 text-xs text-zinc-900 dark:text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 dark:focus:border-zinc-500 transition-all"
            />
          </form>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger for Mobile */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              aria-label="Search"
            >
              <FiSearch size={20} />
            </button>

            {/* Light / Dark Mode Toggle */}
            <ThemeToggle />

            {/* Write Story CTA */}
            {user ? (
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-600/15 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-600/25 text-xs font-semibold tracking-wide transition-colors"
              >
                <FiEdit3 size={14} />
                <span>Write Story</span>
              </Link>
            ) : null}

            {/* User Dropdown / Auth Buttons */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 transition-colors"
                >
                  <img
                    src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                      user.username || "Editor"
                    )}`}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700"
                  />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl overflow-hidden py-1.5 z-50 transition-colors"
                    >
                      <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800/80">
                        <p className="text-xs font-semibold text-zinc-950 dark:text-white tracking-wide truncate">
                          {user.username}
                        </p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                          {user.email || "Staff Contributor"}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-zinc-950 dark:hover:text-white transition-colors"
                        >
                          <FiEdit3 size={14} className="text-blue-600 dark:text-blue-400" />
                          <span>Writer Dashboard</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-zinc-950 dark:hover:text-white transition-colors"
                        >
                          <FiUser size={14} className="text-zinc-500 dark:text-zinc-400" />
                          <span>Author Profile</span>
                        </Link>
                      </div>

                      <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-1">
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors font-medium"
                        >
                          <FiLogOut size={14} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm border border-zinc-900 dark:border-white"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Input Drawer */}
        {searchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="md:hidden pb-3 pt-1 flex items-center gap-2"
          >
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-2.5 text-zinc-400 dark:text-zinc-500" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories..."
                autoFocus
                className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-zinc-900 dark:text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-lg text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              Search
            </button>
          </form>
        )}
      </div>

      {/* Editorial Category Sub-bar (Newspaper Section Header) */}
      <div className="hidden lg:block border-t border-zinc-200 dark:border-zinc-800/60 bg-zinc-50/70 dark:bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none text-xs font-medium text-zinc-600 dark:text-zinc-400">
            {CATEGORIES.map((cat) => {
              const queryParam =
                cat.value === "All"
                  ? ""
                  : `?category=${encodeURIComponent(cat.value)}`;
              const currentCat = new URLSearchParams(location.search).get("category") || "All";
              const isSelected =
                location.pathname === "/blogs" && currentCat.toLowerCase() === cat.value.toLowerCase();

              return (
                <Link
                  key={cat.value}
                  to={`/blogs${queryParam}`}
                  className={`whitespace-nowrap px-3.5 py-1 rounded-md transition-colors ${
                    isSelected
                      ? "text-zinc-900 dark:text-white bg-zinc-200 dark:bg-zinc-800 font-semibold"
                      : "hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-5 py-4 space-y-3"
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                Sections & Desks
              </p>
              <ThemeToggle showLabel />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.value}
                  to={
                    cat.value === "All"
                      ? "/blogs"
                      : `/blogs?category=${encodeURIComponent(cat.value)}`
                  }
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/70 text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white"
                >
                  {cat.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80 space-y-1 text-xs">
              <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className="block py-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              >
                About The Publication
              </Link>
              <Link
                to="/guidelines"
                onClick={() => setIsOpen(false)}
                className="block py-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              >
                Editorial Guidelines
              </Link>
              <Link
                to="/support"
                onClick={() => setIsOpen(false)}
                className="block py-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              >
                Support & Contact
              </Link>
            </div>

            {/* Mobile User / Auth Status */}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900/80">
                    <img
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                        user.username || "User"
                      )}`}
                      alt="User avatar"
                      className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-white truncate">
                        {user.username}
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate">
                        {user.email || "Contributor"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-xs border border-blue-200 dark:border-blue-500/20"
                    >
                      <FiEdit3 size={13} /> Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-xs border border-zinc-200 dark:border-zinc-700"
                    >
                      <FiUser size={13} /> Profile
                    </Link>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-xs font-semibold transition-colors"
                  >
                    <FiLogOut size={13} /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center py-2 px-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="text-center py-2 px-3 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
