import { Link } from "react-router-dom";
import { FaTwitter, FaGithub, FaInstagram, FaFacebook } from "react-icons/fa";
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
    <footer className="relative pt-20 pb-10 overflow-hidden">
      {/* Glass Background Panel */}
      <div className="absolute inset-x-0 bottom-0 top-12 bg-black/20 backdrop-blur-xl border-t border-white/5" />

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
              <img src={Logo} alt="Blogsify" className="h-8 opacity-90" />
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
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
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 hover:text-white text-white/60 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-white/10"
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
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-blue-500 rounded-full"></span> Explore
            </h4>
            <ul className="space-y-3 text-sm text-white/50">
              {["Blogs", "Home", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
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
            <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-4 bg-purple-500 rounded-full"></span>{" "}
              Resources
            </h4>
            <ul className="space-y-3 text-sm text-white/50">
              <li>
                <Link
                  to="/guidelines"
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Writing Guidelines
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                {user ? (
                  <Link
                    to="/dashboard"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="hover:text-white transition-colors hover:translate-x-1 inline-block"
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
            className="bg-white/5 p-6 rounded-2xl border border-white/5 backdrop-blur-sm"
          >
            <h4 className="text-white font-semibold mb-2">Stay Updated</h4>
            <p className="text-white/50 text-xs mb-4 leading-relaxed">
              Get the latest stories and updates delivered to your inbox with
              our weekly newsletter.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-white/30 focus:bg-black/30 transition-all text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Join
                </button>
              </div>
              {status && <p className="text-xs text-blue-300 ml-1">{status}</p>}
            </form>
          </motion.div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Blogsify. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/40">
            <Link to="/sitemap" className="hover:text-white transition-colors">
              Sitemap
            </Link>
            <Link to="/support" className="hover:text-white transition-colors">
              Support
            </Link>
            <span className="flex items-center gap-1">
              Made by{" "}
              <a
                href="https://codesrahul.vercel.app"
                className="text-white/60 hover:text-white hover:underline"
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
