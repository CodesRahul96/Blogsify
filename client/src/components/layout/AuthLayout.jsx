import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "../../assets/lettering.png";
import { FiCheckCircle, FiShield, FiFeather, FiTrendingUp } from "react-icons/fi";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex items-center justify-center relative overflow-hidden pt-28 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Subtle Background Glows */}
      <div className="pointer-events-none absolute top-10 left-1/4 -translate-x-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 translate-x-1/2 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Side: Editorial Publication Mission */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex lg:col-span-6 flex-col justify-center space-y-7"
        >
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src={Logo}
                alt="Blogsify"
                className="h-8 object-contain filter contrast-125 dark:brightness-100"
              />
              <span className="pl-3 border-l border-zinc-300 dark:border-zinc-700 text-[11px] font-serif uppercase tracking-widest text-zinc-500">
                The Journal of Modern Ideas
              </span>
            </Link>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-zinc-950 dark:text-white tracking-tight leading-tight">
              Where curious minds share perspectives.
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">
              Join an independent publication community of developers, designers, security analysts, and storytellers producing insightful commentary.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                icon: FiFeather,
                title: "Distraction-Free Editorial Desk",
                desc: "Full Markdown composition, video embeds, and curated tagging.",
              },
              {
                icon: FiShield,
                title: "Verified Reader Community",
                desc: "High-signal discourse without algorithm noise or clickbait.",
              },
              {
                icon: FiTrendingUp,
                title: "Front Page Editorial Shelves",
                desc: "Dispatches distributed directly to thousands of curious readers.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 shadow-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-zinc-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center gap-3 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <FiCheckCircle className="text-emerald-500" size={13} /> Free reader account
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FiCheckCircle className="text-emerald-500" size={13} /> Instant publication
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <FiCheckCircle className="text-emerald-500" size={13} /> Dark & light themes
            </span>
          </div>
        </motion.div>

        {/* Right Side: Elevated Form Container */}
        <div className="lg:col-span-6 flex items-center justify-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md p-7 sm:p-9 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl transition-colors duration-200"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
