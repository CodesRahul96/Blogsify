import { motion } from "framer-motion";
import Logo from "../../assets/lettering.png";

function Loader({ fullScreen = true, message = "Loading dispatch..." }) {
  const content = (
    <div className="flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Editorial Monogram / Spinner Frame */}
      <div className="relative flex items-center justify-center w-16 h-16 mb-5">
        {/* Subtle Outer Track Ring */}
        <div className="absolute inset-0 rounded-full border border-zinc-800" />

        {/* Minimal High-Precision Rotating Indicator */}
        <div className="absolute inset-0 rounded-full border-t-2 border-r border-transparent border-t-blue-500 border-r-blue-400/40 animate-spin" />

        {/* Center Publication Monogram */}
        <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center shadow-inner">
          <motion.img
            src={Logo}
            alt="Blogsify"
            className="w-6 h-6 object-contain opacity-90 dark:brightness-100 invert dark:invert-0"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Editorial Status Text */}
      <div className="space-y-1.5">
        <p className="font-serif text-sm font-semibold tracking-wide text-zinc-800 dark:text-zinc-200">
          Blogsify
        </p>
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          <span>{message}</span>
          <span className="flex space-x-0.5">
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
            >
              .
            </motion.span>
          </span>
        </div>
      </div>

      {/* Sleek Line Progress Ticker */}
      <div className="w-32 h-[2px] bg-zinc-200 dark:bg-zinc-800/80 rounded-full overflow-hidden mt-4">
        <motion.div
          className="h-full bg-blue-600 dark:bg-blue-500"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );

  if (!fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex justify-center items-center py-12"
      >
        {content}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 flex items-center justify-center z-[9999] bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-sm transition-colors duration-200"
    >
      {content}
    </motion.div>
  );
}

export default Loader;
