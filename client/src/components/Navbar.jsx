import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-3 px-2">
      <div className=" mx-auto flex justify-between md:justify-around items-center">
        <Link
          to="/"
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
        >
          Blogsify
        </Link>

        <button
          className="md:hidden focus:outline-none bg-gradient-to-r text-2xl p-2 rounded-full from-blue-400 to-purple-400"
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
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
        <div className="hidden md:flex space-x-6 items-center">
          {!user ? (
            <Link
              to="/"
              className="hover:text-blue-400 transition-colors duration-300"
            >
              Home
            </Link>
          ) : (
            <></>
          )}
          <Link
            to="/blogs"
            className="hover:text-blue-400 transition-colors duration-300"
          >
            Blogs
          </Link>
          {user ? (
            <>
              {user.isAdmin && (
                <Link
                  to="/dashboard"
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  Dashboard
                </Link>
              )}

              <span className="text-gray-300">
                Welcome, {user.username || "User"}
              </span>

              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded hover:bg-gray-800 bg-gradient-to-r from-red-400 to-purple-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-blue-400 transition-colors duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden mt-4 space-y-8 px-8 flex flex-col items-center gap-3 text-center align-center justify-center">
          {!user ? (
            <Link
              to="/"
              className="hover:text-blue-400 transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
          ) : (
            <></>
          )}
          <Link
            to="/blogs"
            className="block hover:text-gray-300"
            onClick={() => setIsOpen(false)}
          >
            {/* Update to /blogs */}
            Blogs
          </Link>
          {user ? (
            <>
              <span className="block text-gray-300">
                Welcome, {user.username || "User"}
              </span>
              {user.isAdmin && (
                <Link
                  to="/dashboard"
                  className="block hover:text-gray-300"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout(), setIsOpen(false);
                }}
                className="block w-full px-3 py-1 rounded bg-gradient-to-r from-red-400 to-purple-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block hover:text-gray-300"
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
