import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const GlassCard = ({ children, className, hoverEffect = false, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 text-zinc-900 dark:text-zinc-100 shadow-sm transition-colors duration-150",
        hoverEffect && "hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
