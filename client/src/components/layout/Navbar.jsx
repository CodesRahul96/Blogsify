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
  FiCompass,
  FiChevronDown,
  FiBookmark,
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

  // Close menus on page navigation
  useEffect(() => {
    setIsOpen(false);
    setSearchOpen(false);
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  // Handle outside click for user dropdown
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
      {/* Top Editorial Ribbon (Desktop) */}
      <div className="hidden lg:block border-b border-zinc-200 dark:border-zinc-800/50 py-2.5 px-6 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950/60">
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

          <div className="flex items-center gap-6 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <Link
              to="/guidelines"
              className="hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              Writing Standards
            </Link>
            <Link
              to="/about"
              className="hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              About The Journal
            </Link>
            <Link
              to="/support"
              className="hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              Support & Ethics
            </Link>
          </div>
        </div>
      </div>

      {/* Main Masthead Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-18 lg:h-20">
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                if (searchOpen) setSearchOpen(false);
              }}
              className="lg:hidden p-1.5 sm:p-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <img
                src={Logo}
                alt="Blogsify"
                className="h-6 sm:h-8 lg:h-9 object-contain filter contrast-125 dark:brightness-100 invert dark:invert-0 transition-transform group-hover:scale-[1.02]"
              />
              <span className="hidden md:inline-block pl-3 border-l border-zinc-300 dark:border-zinc-700/60 text-xs font-serif text-zinc-600 dark:text-zinc-400">
                The Journal of Modern Ideas
              </span>
            </Link>
          </div>

          {/* Compact Right-Aligned Search Input (Desktop - Issue 14) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center relative w-48 lg:w-64 ml-auto mr-3"
          >
            <FiSearch
              className="absolute left-3 text-zinc-400 dark:text-zinc-500"
              size={14}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories, topics..."
              className="w-full bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-full pl-8 pr-3.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all shadow-2xs"
            />
          </form>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (isOpen) setIsOpen(false);
              }}
              className="md:hidden p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
              aria-label="Search"
            >
              <FiSearch size={18} />
            </button>

            {/* Dark/Light Theme Toggle */}
            <ThemeToggle />

            {/* Write Story CTA (Desktop & Tablet) */}
            {user && (
              <Link
                to="/dashboard?tab=write"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 h-9 rounded-full bg-blue-50 dark:bg-blue-600/15 border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-600/25 text-xs font-semibold tracking-wide transition-colors"
              >
                <FiEdit3 size={13} />
                <span>Write</span>
              </Link>
            )}

            {/* Logged-In User Profile Pill or Guest Auth */}
            {user ? (
              <div className="relative" ref={menuRef}>
                {/* Elevated Interactive Profile Pill Trigger */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={`group flex items-center gap-2 pl-1.5 pr-2.5 sm:pr-3 py-1 rounded-full border transition-all duration-200 focus:outline-none ${
                    menuOpen
                      ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 shadow-sm"
                      : "bg-zinc-50 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 border-zinc-200 dark:border-zinc-800/90 shadow-2xs"
                  }`}
                  aria-label="User menu"
                >
                  <div className="relative">
                    <img
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                        user.username || "Editor"
                      )}`}
                      alt="Avatar"
                      className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 object-cover ring-2 ring-blue-500/20"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-zinc-900" />
                  </div>

                  {/* Name and Role Badging (Desktop & Tablet) */}
                  <div className="hidden sm:flex flex-col items-start text-left leading-tight pr-1">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white max-w-[90px] lg:max-w-[120px] truncate">
                      {user.username}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">
                      {user.isAdmin ? "Admin Desk" : "Writer"}
                    </span>
                  </div>

                  <FiChevronDown
                    size={13}
                    className={`text-zinc-400 dark:text-zinc-500 transition-transform duration-200 ${
                      menuOpen ? "rotate-180 text-zinc-900 dark:text-white" : "group-hover:text-zinc-700 dark:group-hover:text-zinc-300"
                    }`}
                  />
                </button>

                {/* Enhanced Dropdown Menu Card */}
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden py-1.5 z-50 transition-colors"
                    >
                      {/* Dropdown Header Card */}
                      <div className="p-4 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-800/40 dark:to-zinc-900 border-b border-zinc-100 dark:border-zinc-800/80">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                              user.username || "Editor"
                            )}`}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 shadow-xs"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-bold font-serif text-zinc-950 dark:text-white truncate">
                                {user.username}
                              </p>
                              {user.isAdmin && (
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                  Admin
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                              {user.email || "Staff Contributor"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Dropdown Navigation Actions */}
                      <div className="p-1.5 space-y-0.5">
                        {user.isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-amber-700 dark:text-amber-400 bg-amber-50/70 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors group font-semibold"
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="w-2 h-2 rounded-full bg-amber-500" />
                              <span>Admin Panel</span>
                            </span>
                            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">
                              Manage
                            </span>
                          </Link>
                        )}

                        <Link
                          to="/dashboard"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-zinc-950 dark:hover:text-white transition-colors group"
                        >
                          <span className="flex items-center gap-2.5 font-medium">
                            <FiEdit3 size={14} className="text-blue-600 dark:text-blue-400" />
                            <span>Writer Dashboard</span>
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                            Stories
                          </span>
                        </Link>

                        <Link
                          to="/profile"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-zinc-950 dark:hover:text-white transition-colors group"
                        >
                          <span className="flex items-center gap-2.5 font-medium">
                            <FiUser size={14} className="text-zinc-500 dark:text-zinc-400" />
                            <span>Author Profile</span>
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                            Settings
                          </span>
                        </Link>

                        <Link
                          to="/guidelines"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-zinc-950 dark:hover:text-white transition-colors group"
                        >
                          <span className="flex items-center gap-2.5 font-medium">
                            <FiBookmark size={14} className="text-zinc-500 dark:text-zinc-400" />
                            <span>Writing Standards</span>
                          </span>
                        </Link>
                      </div>

                      {/* Sign Out Footer */}
                      <div className="border-t border-zinc-100 dark:border-zinc-800/80 p-1.5">
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors font-medium text-left"
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
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <Link
                  to="/login"
                  className="px-2.5 sm:px-3 h-9 inline-flex items-center text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 sm:px-4 h-9 inline-flex items-center rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-xs border border-zinc-900 dark:border-white"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Input Drawer with Animation */}
        <AnimatePresence>
          {searchOpen && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onSubmit={handleSearchSubmit}
              className="md:hidden pb-3 pt-1 flex items-center gap-2 overflow-hidden"
            >
              <div className="relative flex-1">
                <FiSearch
                  className="absolute left-3 top-2.5 text-zinc-400 dark:text-zinc-500"
                  size={15}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, topics..."
                  autoFocus
                  className="w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl text-xs font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shrink-0"
              >
                Search
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Category Sub-bar (Hidden on home page where the editorial filter shelf already provides local category filtering - Issue 10) */}
      {location.pathname !== "/" && (
        <div className="hidden lg:block border-t border-zinc-200 dark:border-zinc-800/60 bg-zinc-50/70 dark:bg-zinc-950/40">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none text-xs font-medium text-zinc-600 dark:text-zinc-400" aria-label="Category navigation">
              {CATEGORIES.map((cat) => {
                const queryParam =
                  cat.value === "All"
                    ? ""
                    : `?category=${encodeURIComponent(cat.value)}`;
                const currentCat =
                  new URLSearchParams(location.search).get("category") || "All";
                const isSelected =
                  location.pathname === "/blogs"
                    ? currentCat.toLowerCase() === cat.value.toLowerCase()
                    : cat.value === "All";

                return (
                  <Link
                    key={cat.value}
                    to={`/blogs${queryParam}`}
                    aria-current={isSelected ? "page" : undefined}
                    className={`whitespace-nowrap px-3.5 py-1.5 rounded-md text-xs transition-all ${
                      isSelected
                        ? "text-zinc-950 dark:text-white bg-zinc-200/90 dark:bg-zinc-800 font-semibold shadow-xs border-b-2 border-blue-600 dark:border-blue-400"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
                    }`}
                  >
                    {cat.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Drawer Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b] px-4 py-4 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            {/* User Profile Card in Drawer */}
            {user ? (
              <div className="p-4 rounded-2xl bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/90 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 shadow-xs">
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="relative">
                    <img
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
                        user.username || "User"
                      )}`}
                      alt="User avatar"
                      className="w-11 h-11 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 shadow-xs object-cover"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold font-serif text-zinc-950 dark:text-white truncate">
                        {user.username}
                      </p>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                        {user.isAdmin ? "Admin" : "Writer"}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                      {user.email || "Publication Contributor"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/dashboard?tab=write"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-xs border border-blue-200 dark:border-blue-500/20 active:scale-98 transition-transform"
                  >
                    <FiEdit3 size={13} /> Write Story
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-xs border border-zinc-200 dark:border-zinc-700 active:scale-98 transition-transform"
                  >
                    <FiUser size={13} /> Profile
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/70">
                <p className="text-xs font-semibold text-zinc-900 dark:text-white mb-1">
                  Join The Community
                </p>
                <p className="text-[11px] text-zinc-500 mb-3">
                  Read unlimited dispatches and publish your perspective.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center py-2.5 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="text-center py-2.5 px-3 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-bold shadow-xs hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            )}

            {/* Publication Desks / Categories Section */}
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2.5 px-1">
                <FiCompass size={12} />
                <span>Editorial Desks</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => {
                  const currentCat =
                    new URLSearchParams(location.search).get("category") || "All";
                  const isSelected =
                    location.pathname === "/blogs"
                      ? currentCat.toLowerCase() === cat.value.toLowerCase()
                      : cat.value === "All";

                  return (
                    <Link
                      key={cat.value}
                      to={
                        cat.value === "All"
                          ? "/blogs"
                          : `/blogs?category=${encodeURIComponent(cat.value)}`
                      }
                      onClick={() => setIsOpen(false)}
                      aria-current={isSelected ? "page" : undefined}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 border-zinc-950 dark:border-white font-semibold shadow-xs"
                          : "bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {cat.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Quick Publication Links */}
            <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 px-1">
                Publication Links
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="py-2 px-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                >
                  About
                </Link>
                <Link
                  to="/guidelines"
                  onClick={() => setIsOpen(false)}
                  className="py-2 px-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                >
                  Guidelines
                </Link>
                <Link
                  to="/support"
                  onClick={() => setIsOpen(false)}
                  className="py-2 px-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                >
                  Support
                </Link>
              </div>
            </div>

            {/* Log Out Button in Drawer for Logged In Users */}
            {user && (
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800/80">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-xs font-semibold transition-colors active:scale-98"
                >
                  <FiLogOut size={14} />
                  <span>Sign Out of Blogsify</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
