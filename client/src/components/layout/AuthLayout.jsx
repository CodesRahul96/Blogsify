import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "../../assets/lettering.png";
import { FiCheckCircle, FiShield, FiFeather, FiTrendingUp } from "react-icons/fi";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 flex items-center justify-center relative overflow-hidden pt-20 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Background Decorative Patterns */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      {/* Atmospheric Ambient Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 sm:left-1/4 -translate-x-1/2 w-72 sm:w-[480px] h-72 sm:h-[480px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl sm:blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-24 right-1/2 sm:right-1/4 translate-x-1/2 w-72 sm:w-[480px] h-72 sm:h-[480px] bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl sm:blur-[110px]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        {/* Left Editorial Mission Column (Desktop & Tablet Wide) */}
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
                className="h-8 object-contain filter contrast-125 dark:brightness-100 invert dark:invert-0"
              />
              <span className="pl-3 border-l border-zinc-300 dark:border-zinc-700 text-xs font-serif uppercase tracking-widest text-zinc-500">
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
                  <h2 className="text-xs font-semibold text-zinc-900 dark:text-white">
                    {item.title}
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
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

        {/* Right Form Column (Mobile & Desktop Responsive) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center w-full">
          {/* Mobile Masthead Monogram (Visible only on small screens) */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex flex-col items-center gap-2">
              <img
                src={Logo}
                alt="Blogsify"
                className="h-8 object-contain filter contrast-125 dark:brightness-100 invert dark:invert-0"
              />
              <span className="text-xs font-serif uppercase tracking-widest text-zinc-500">
                The Journal of Modern Ideas
              </span>
            </Link>
          </div>

          {/* Elevated Responsive Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-md p-6 sm:p-9 rounded-3xl bg-white/95 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 shadow-xl dark:shadow-2xl backdrop-blur-md transition-colors duration-200"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
