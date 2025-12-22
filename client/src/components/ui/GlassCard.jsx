import { motion } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const GlassCard = ({ children, className, hoverEffect = false, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={
        hoverEffect ? { scale: 1.02, transition: { duration: 0.2 } } : {}
      }
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-white/20 bg-white/10 p-6 backdrop-blur-2xl shadow-xl",
        className
      )}
      {...props}
    >
      {/* Glossy gradient overlay */}
      <div
        className="pointer-events-none absolute -inset-[100%] z-0 opacity-20"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4), transparent 50%)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;
