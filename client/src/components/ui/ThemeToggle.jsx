import { useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";

export default function ThemeToggle({ showLabel = false, className = "" }) {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const buttonRef = useRef(null);

  const handleClick = (e) => {
    let coords = null;
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      coords = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    } else if (e?.clientX || e?.clientY) {
      coords = { x: e.clientX, y: e.clientY };
    }

    toggleTheme({
      element: buttonRef.current,
      coords,
    });
  };

  const getTitle = () => {
    if (theme === "system") {
      return `Theme: Auto (System is currently ${resolvedTheme}). Click to change.`;
    }
    return `Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}. Click to change.`;
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        data-theme-toggle="true"
        onClick={handleClick}
        className="flex items-center gap-1.5 p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors touch-manipulation select-none"
        title={getTitle()}
        aria-label="Toggle theme mode"
      >
        {theme === "system" ? (
          <FiMonitor size={16} className="text-zinc-600 dark:text-zinc-300" />
        ) : resolvedTheme === "dark" ? (
          <FiMoon size={16} className="text-blue-400" />
        ) : (
          <FiSun size={16} className="text-amber-500" />
        )}
        {showLabel && (
          <span className="text-xs capitalize font-medium">
            {theme === "system" ? "Auto" : theme}
          </span>
        )}
      </button>
    </div>
  );
}
