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
      className="aspect-square flex flex-col items-center justify-center gap-1 cursor-pointer rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 shadow-lg"
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
      title={label}
    >
      <span className="text-xl text-white">
        <Icon />
      </span>
    </motion.div>
  );
};

const Dock = ({ items = [] }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex h-20 items-end gap-3 rounded-[32px] bg-black/20 border border-white/10 px-4 pb-3 pt-3 backdrop-blur-2xl"
      >
        {items.map((item, idx) => (
          <DockIcon key={idx} mouseX={mouseX} {...item} />
        ))}
      </motion.div>
    </div>
  );
};

export default Dock;
