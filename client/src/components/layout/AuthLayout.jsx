import "react";
import GlassCard from "./ui/GlassCard";
import { motion } from "framer-motion";

// eslint-disable-next-line react/prop-types
function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background handled by global index.css now, but we can add a localized overlay if needed */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex flex-col justify-center text-white space-y-6"
        >
          <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Welcome to <br /> Blogsify
          </h1>
          <p className="text-lg text-white/60 leading-relaxed max-w-md">
            Create, discover, and share thoughtful stories. Join a community of
            writers and readers on a platform designed for focus.
          </p>

          <div className="space-y-4 pt-4">
            {[
              {
                title: "Clean Editor",
                desc: "Distraction-free writing environment.",
              },
              {
                title: "Responsive Themes",
                desc: "Beautiful on every device.",
              },
              {
                title: "Community",
                desc: "Engage with readers and other writers.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-white/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side Form */}
        <div className="flex items-center justify-center w-full">
          <GlassCard className="w-full max-w-md p-8 md:p-10 shadow-2xl border-white/10">
            {children}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
