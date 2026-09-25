import { useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle({ showLabel = false, className = "" }) {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const buttonRef = useRef(null);

  const handleClick = (e) => {
    // FIX 8: Do NOT call e.preventDefault() so touch event dispatching is not disrupted.
    // FIX 2: Compute physical center of button from getBoundingClientRect() via ref
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

  return (
    <div className={`relative flex items-center ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        data-theme-toggle="true"
        onClick={handleClick}
        className="flex items-center gap-1.5 p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors touch-manipulation select-none"
        title={`Current: ${theme} mode (Click to switch)`}
        aria-label="Toggle theme mode"
      >
        {resolvedTheme === "dark" ? (
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
