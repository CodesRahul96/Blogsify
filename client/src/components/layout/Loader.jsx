import { motion } from "framer-motion";
import Logo from "../../assets/lettering.png";

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      {/* Glass overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xl" />

      {/* Loader Content */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-24 h-24 flex items-center justify-center mb-8">
          {/* Rotating Rings - using standard animate-spin with style overrides for speed */}
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/30 border-r-white/10 animate-spin"
            style={{ animationDuration: "3s" }}
          />
          <div
            className="absolute inset-2 rounded-full border-2 border-transparent border-t-blue-400/50 border-l-purple-400/50 animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "2s" }}
          />

          {/* Center Logo */}
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl relative z-10">
            <motion.img
              src={Logo}
              alt="Loading..."
              className="w-10 h-10 object-contain"
              animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>

        {/* Loading Bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}

export default Loader;
