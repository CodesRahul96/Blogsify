import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
// FiHome, FiLayout, FiUser, FiSettings, FiLogOut, FiGrid removed as unused
import {} from "react-icons/fi";
// Magnification constraints
const DISTANCE = 140;

const DockIcon = ({ mouseX, icon: Icon, label, path, onClick }) => {
  const ref = useRef(null);
  const navigate = useNavigate();

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distance,
    [-DISTANCE, 0, DISTANCE],
    [45, 80, 45]
  );
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const handleClick = () => {
    if (onClick) onClick();
    if (path) navigate(path);
  };

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="aspect-square flex flex-col items-center justify-center gap-1 cursor-pointer rounded-2xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 shadow-md transition-colors"
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      title={label}
    >
      <span className="text-xl text-zinc-800 dark:text-zinc-100">
        <Icon />
      </span>
    </motion.div>
  );
};

const Dock = ({ items = [] }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[95vw]">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex h-16 sm:h-20 items-end gap-2 sm:gap-3 rounded-[28px] sm:rounded-[32px] bg-white/90 dark:bg-zinc-900/90 border border-zinc-300 dark:border-zinc-800 px-3 sm:px-4 pb-2 sm:pb-3 pt-2 sm:pt-3 backdrop-blur-2xl shadow-xl dark:shadow-2xl transition-colors overflow-x-auto scrollbar-none"
      >
        {items.map((item, idx) => (
          <DockIcon key={idx} mouseX={mouseX} {...item} />
        ))}
      </motion.div>
    </div>
  );
};

export default Dock;
