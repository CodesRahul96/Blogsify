import { Link } from "react-router-dom";
import { FiTwitter, FiGithub, FiInstagram, FiFacebook } from "react-icons/fi";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Logo from "../../assets/lettering.png";
import { motion } from "framer-motion";

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
    setTimeout(() => {
      setStatus("Thanks for subscribing!");
      setEmail("");
    }, 900);
  };

  return (
    <footer className="relative pt-16 pb-10 bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800/80 transition-colors duration-200">
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Link to="/" className="flex items-center gap-3">
              <img src={Logo} alt="Blogsify" className="h-8 opacity-90 dark:brightness-100 invert dark:invert-0" />
            </Link>
            <p className="text-zinc-600 dark:text-white/50 text-sm leading-relaxed max-w-xs">
              A modern platform for thoughtful writing. Discover stories, share
              ideas, and connect with a community of creators.
            </p>

            <div className="flex items-center gap-4">
              {[
                {
                  icon: FaGithub,
                  link: "https://github.com/codesrahul96",
                  label: "GitHub",
                },
                {
                  icon: FaTwitter,
                  link: "https://twitter.com/codesrahul96",
                  label: "Twitter",
                },
                {
                  icon: FaFacebook,
                  link: "https://facebook.com/codesrahul",
                  label: "Facebook",
                },
                {
                  icon: FaInstagram,
                  link: "https://instagram.com/codesrahul",
                  label: "Instagram",
                },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-600 hover:text-zinc-900 dark:text-white/60 dark:hover:text-white transition-all hover:-translate-y-1 hover:shadow-md"
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            {/* Issue 9: Fixed heading level from h4 to h3 to follow h2 correctly */}
            <h3 className="text-zinc-900 dark:text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span> Explore
            </h3>
            <ul className="space-y-3 text-sm text-zinc-600 dark:text-white/50">
              {["Blogs", "Home", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="hover:text-zinc-950 dark:hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Issue 9: Fixed heading level from h4 to h3 to follow h2 correctly */}
            <h3 className="text-zinc-900 dark:text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-500 rounded-full"></span>{" "}
              Resources
            </h3>
            <ul className="space-y-3 text-sm text-zinc-600 dark:text-white/50">
              <li>
                <Link
                  to="/guidelines"
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Writing Guidelines
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                {user ? (
                  <Link
                    to="/dashboard"
                    className="hover:text-zinc-950 dark:hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="hover:text-zinc-950 dark:hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-zinc-50 dark:bg-white/5 p-6 rounded-2xl border border-zinc-200 dark:border-white/5 backdrop-blur-sm"
          >
            {/* Issue 9: Fixed heading level from h4 to h3 */}
            <h3 className="text-zinc-900 dark:text-white font-semibold mb-2">Stay Updated</h3>
            <p className="text-zinc-600 dark:text-white/50 text-xs mb-4 leading-relaxed">
              Get the latest stories and updates delivered to your inbox with
              our weekly newsletter.
            </p>
            {/* Issue 13: Standardized newsletter input and button style */}
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-4 pr-20 py-2.5 rounded-full bg-white dark:bg-black/20 border border-zinc-300 dark:border-white/10 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-white/20 focus:outline-none focus:border-zinc-500 dark:focus:border-white/30 transition-all text-xs shadow-2xs"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-4 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-xs font-semibold transition-colors shadow-xs"
                >
                  Join
                </button>
              </div>
              {status && <p className="text-xs text-blue-600 dark:text-blue-300 ml-1">{status}</p>}
            </form>
          </motion.div>
        </div>

        <div className="pt-8 border-t border-zinc-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500 dark:text-white/30">
            © {new Date().getFullYear()} Blogsify. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-zinc-500 dark:text-white/40">
            <Link to="/sitemap" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Sitemap
            </Link>
            <Link to="/support" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Support
            </Link>
            <span className="flex items-center gap-1">
              Made by{" "}
              <a
                href="https://codesrahul.vercel.app"
                className="text-zinc-700 dark:text-white/60 hover:text-zinc-950 dark:hover:text-white hover:underline font-medium"
              >
                CodesRahul
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
