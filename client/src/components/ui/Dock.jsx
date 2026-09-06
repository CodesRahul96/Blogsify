import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

// Magnification distance for desktop hover effect
const DISTANCE = 120;

// ─── Desktop Dock Icon (magnification on hover) ────────────────────────────
const DesktopDockIcon = ({ mouseX, icon: Icon, label, path, onClick }) => {
  const ref = useRef(null);
  const navigate = useNavigate();

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-DISTANCE, 0, DISTANCE], [44, 72, 44]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  const handleClick = () => {
    if (onClick) onClick();
    if (path) navigate(path);
  };

  return (
    <motion.button
      ref={ref}
      style={{ width }}
      className="aspect-square flex flex-col items-center justify-center gap-1 cursor-pointer rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 shadow-md transition-colors shrink-0"
      onClick={handleClick}
      whileTap={{ scale: 0.88 }}
      title={label}
    >
      <span className="text-xl text-zinc-700 dark:text-zinc-100">
        <Icon />
      </span>
    </motion.button>
  );
};

// ─── Mobile Tab Bar Item (flat, always full size, with label) ──────────────
const MobileTabItem = ({ icon: Icon, label, path, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    if (path) navigate(path);
  };

  return (
    <button
      onClick={handleClick}
      className="flex-1 flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 transition-all"
    >
      <span className="text-[22px]">
        <Icon />
      </span>
      <span className="text-[10px] font-medium tracking-wide leading-none">{label}</span>
    </button>
  );
};

// ─── Dock (desktop) + Tab Bar (mobile) ────────────────────────────────────
const Dock = ({ items = [] }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <>
      {/* ── Mobile: full-width bottom tab bar ── */}
      <div
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-zinc-900/95 border-t border-zinc-200 dark:border-zinc-800 backdrop-blur-xl px-2"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <div className="flex items-center h-16">
          {items.map((item, idx) => (
            <MobileTabItem key={idx} {...item} />
          ))}
        </div>
      </div>

      {/* ── Desktop: floating magnifying dock ── */}
      <div className="hidden sm:block fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <motion.div
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="flex h-20 items-end gap-3 rounded-[32px] bg-white/90 dark:bg-zinc-900/90 border border-zinc-300 dark:border-zinc-800 px-4 pb-3 pt-3 backdrop-blur-2xl shadow-xl transition-colors"
        >
          {items.map((item, idx) => (
            <DesktopDockIcon key={idx} mouseX={mouseX} {...item} />
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default Dock;
