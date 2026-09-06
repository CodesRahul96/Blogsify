import { useTheme } from "../../context/ThemeContext";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";

export default function ThemeToggle({ showLabel = false, className = "" }) {
  const { theme, resolvedTheme, toggleTheme, setTheme } = useTheme();

  return (
    <div className={`relative flex items-center ${className}`}>
      <button
        onClick={toggleTheme}
        className="flex items-center gap-1.5 p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
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
