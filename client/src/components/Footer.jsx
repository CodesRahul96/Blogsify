import { Link } from "react-router-dom";
import { FaTwitter, FaGithub, FaInstagram, FaFacebook } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Footer() {
  const user = useContext(AuthContext);
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row space-x-5 justify-between items-center md:items-start gap-10 md:gap-0">
          {/* About Section */}
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            Blogsify
            </h3>
            <p className="text-gray-400 max-w-xs">
              Your go-to platform for insightful blogs and engaging content.
              Explore, read, and share your thoughts with the world!
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold mb-4 text-gray-200">
              Quick Links
            </h4>
{
  !user ? (<>
    <Link
                  to="/blogs"
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  Blogs
                </Link>
                {
                  user.isAdmin && (<><Link
                  to="/dashboard"
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  Dashboard
                </Link></>)
                }
  </>) : (<ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  to="/"
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs"
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  Blogs
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  Register
                </Link>
              </li>
            </ul>)
}

            
          </div>

          {/* Contact Section */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold mb-4 text-gray-200">
              Contact Us
            </h4>
            <p className="text-gray-400">Email: codesrahul96@gmail.com</p>
            <p className="text-gray-400">Phone: +91 8805159425</p>
            <p className="text-gray-400">
              Address: Pune, Maharashtra, India
            </p>
          </div>

          {/* Social Media Section */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-lg font-semibold mb-4 text-gray-200">
              Follow Us
            </h4>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                <FaTwitter fill="currentColor" className="w-6 h-6" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                <FaFacebook className="w-6 h-6" fill="currentColor" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                <FaInstagram className="w-6 h-6" fill="currentColor" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Blogsify. All rights reserved.</p>
          <p>Made with ❤️ by CodesRahul</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
