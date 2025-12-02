import 'react';
import { Link } from "react-router-dom";
import { FaTwitter, FaGithub, FaInstagram, FaFacebook } from "react-icons/fa";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Logo from "../assets/lettering.png";

function Footer() {
  const { user } = useContext(AuthContext) || {};
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("Please enter a valid email address.");
      return;
    }
    setStatus("Sending...");
    // Simulate async subscribe (replace with real API if available)
    setTimeout(() => {
      setStatus("Thanks for subscribing!");
      setEmail("");
    }, 900);
  };

  return (
    <footer className="bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 text-white pt-12 pb-8">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <img src={Logo} alt="Blogsify" className="h-10" />
              <span className="hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 font-bold text-xl">Blogsify</span>
            </Link>
            <p className="mt-4 text-gray-400 max-w-sm">A home for thoughtful writing — discover and publish stories that matter. Join our community of readers and writers.</p>

            <div className="mt-4 flex items-center gap-3">
              <a href="https://github.com/codesrahul96" className="text-gray-300 hover:text-white/90 transition" aria-label="GitHub" target="_blank" rel="noreferrer"><FaGithub className="w-6 h-6" /></a>
              <a href="https://twitter.com/codesrahul96" className="text-blue-400 hover:text-white/90 transition" aria-label="Twitter" target="_blank" rel="noreferrer"><FaTwitter className="w-6 h-6" /></a>
              <a href="https://facebook.com/codesrahul" className="text-blue-600 hover:text-white/90 transition" aria-label="Facebook" target="_blank" rel="noreferrer"><FaFacebook className="w-6 h-6" /></a>
              <a href="https://instagram.com/codesrahul" className="text-pink-400 hover:text-white/90 transition" aria-label="Instagram" target="_blank" rel="noreferrer"><FaInstagram className="w-6 h-6" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-sm text-gray-300 font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/blogs" className="hover:text-white transition">Blogs</Link></li>
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm text-gray-300 font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">Writing Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms</a></li>
              <li>{user ? <Link to="/dashboard" className="hover:text-white transition">Dashboard</Link> : <Link to="/login" className="hover:text-white transition">Login</Link>}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm text-gray-300 font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-3">Get weekly highlights — new posts and featured writers.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input aria-label="Email for newsletter" type="email" value={email} onChange={(e)=> setEmail(e.target.value)} placeholder="you@domain.com" className="flex-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500" />
              <button type="submit" className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition">Subscribe</button>
            </form>
            {status && <p className="mt-2 text-sm text-gray-300">{status}</p>}
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Blogsify — made with ❤️ by <a href="https://codesrahul.vercel.app" className="underline">CodesRahul</a></p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Link to="/sitemap" className="hover:text-white">Sitemap</Link>
            <Link to="/support" className="hover:text-white">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
