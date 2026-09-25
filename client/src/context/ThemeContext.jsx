import { createContext, useContext, useEffect, useState, useRef } from "react";
import { flushSync } from "react-dom";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Themes: "light", "dark", or "system"
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("blogsify-theme") || "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    const saved = localStorage.getItem("blogsify-theme") || "system";
    if (saved === "system") {
      return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return saved === "dark" ? "dark" : "light";
  });

  const root = typeof document !== "undefined" ? document.documentElement : null;

  const updateStatusBarColor = (isDark) => {
    if (typeof document === "undefined") return;
    const themeColorHex = isDark ? "#09090b" : "#ffffff";

    // 1. Update standard theme-color meta tags
    const metaThemeColors = document.querySelectorAll('meta[name="theme-color"]');
    if (metaThemeColors.length > 0) {
      metaThemeColors.forEach((meta) => {
        meta.setAttribute("content", themeColorHex);
      });
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "theme-color";
      newMeta.content = themeColorHex;
      document.head.appendChild(newMeta);
    }

    // 2. Update Apple iOS status bar style
    const appleMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (appleMeta) {
      appleMeta.setAttribute("content", isDark ? "black-translucent" : "default");
    }
  };

  const applyThemeToDOM = (themeValue) => {
    if (!root) return "light";
    let isDark = false;
    if (themeValue === "system") {
      isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    } else {
      isDark = themeValue === "dark";
    }

    const nextResolved = isDark ? "dark" : "light";
    setResolvedTheme(nextResolved);

    if (isDark) {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }

    updateStatusBarColor(isDark);
    return nextResolved;
  };

  // Sync theme changes with localStorage and system media query
  useEffect(() => {
    applyThemeToDOM(theme);
    localStorage.setItem("blogsify-theme", theme);

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyThemeToDOM("system");
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme]);

  /**
   * Calculate physical button center coordinates and maximum corner radius
   * FIX 2 & FIX 7: Direct button element coordinates with mobile viewport padding buffer
   */
  const calculateCoordinates = (targetElement, coords) => {
    let x = coords?.x;
    let y = coords?.y;

    if (typeof x !== "number" || typeof y !== "number" || (x === 0 && y === 0)) {
      if (targetElement && typeof targetElement.getBoundingClientRect === "function") {
        const rect = targetElement.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      } else {
        // Fallback: search for data-theme-toggle element
        const fallbackEl = document.querySelector('[data-theme-toggle="true"]');
        if (fallbackEl) {
          const rect = fallbackEl.getBoundingClientRect();
          x = rect.left + rect.width / 2;
          y = rect.top + rect.height / 2;
        } else {
          x = window.innerWidth / 2;
          y = window.innerHeight / 2;
        }
      }
    }

    // FIX 7: Calculate end radius using max of inner/client dimensions + safety padding
    const docWidth = Math.max(
      window.innerWidth || 0,
      document.documentElement.clientWidth || 0,
      document.body?.clientWidth || 0
    );
    const docHeight = Math.max(
      window.innerHeight || 0,
      document.documentElement.clientHeight || 0,
      document.body?.clientHeight || 0
    );

    const maxDistX = Math.max(x, docWidth - x);
    const maxDistY = Math.max(y, docHeight - y);
    // Add 24px safety buffer to ensure screen corners are 100% covered across dynamic mobile bars
    const endRadius = Math.hypot(maxDistX, maxDistY) + 24;

    return { x, y, endRadius };
  };

  /**
   * Fallback ripple animation for browsers without document.startViewTransition (FIX 8)
   */
  const triggerFallbackRipple = (x, y, endRadius, targetTheme, callback) => {
    const isNextDark = targetTheme === "dark" || (targetTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const ripple = document.createElement("div");
    ripple.className = "theme-ripple-fallback";
    const size = Math.ceil(endRadius * 2);
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.style.backgroundColor = isNextDark ? "#09090b" : "#fafafa";
    document.body.appendChild(ripple);

    // Apply the theme after slight delay as ripple sweeps across
    setTimeout(() => {
      callback();
    }, 280);

    // Clean up ripple element
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 650);
  };

  /**
   * Main theme toggle handler with View Transitions API & all 8 fixes
   */
  const toggleTheme = (eventOrOptions = {}) => {
    let targetElement = null;
    let coords = null;

    if (eventOrOptions && (eventOrOptions.clientX !== undefined || eventOrOptions.currentTarget !== undefined)) {
      targetElement = eventOrOptions.currentTarget || eventOrOptions.target;
      if (eventOrOptions.clientX || eventOrOptions.clientY) {
        coords = { x: eventOrOptions.clientX, y: eventOrOptions.clientY };
      }
    } else if (eventOrOptions) {
      targetElement = eventOrOptions.element || null;
      coords = eventOrOptions.coords || null;
    }

    const nextTheme = theme === "dark" ? "light" : "dark";

    // If reduced motion is requested, switch immediately without animation
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTheme(nextTheme);
      return;
    }

    const { x, y, endRadius } = calculateCoordinates(targetElement, coords);

    // FIX 8: Check View Transitions API support
    if (!document.startViewTransition) {
      triggerFallbackRipple(x, y, endRadius, nextTheme, () => {
        setTheme(nextTheme);
      });
      return;
    }

    // FIX 4: Wrap theme update & DOM change inside flushSync inside startViewTransition
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
        applyThemeToDOM(nextTheme);
      });
    });

    transition.ready.then(() => {
      const isNextLight = nextTheme === "light" || (nextTheme === "system" && !window.matchMedia("(prefers-color-scheme: dark)").matches);

      /*
       * FIX 1: Keep old snapshot on top (z-index: 9999) and new snapshot underneath (z-index: 1).
       * We animate the old snapshot's clip-path from 100% full screen down to a circle of radius 0
       * centered on the button (x, y).
       * As the old snapshot's circle closes into the button, the new theme reveals smoothly from within!
       * 
       * FIX 3: fill: "forwards" ensures clip-path stays at zero radius permanently until teardown.
       * FIX 5: Fluid curve cubic-bezier(0.35, 0, 0.15, 1) and balanced durations (650ms for light, 580ms for dark).
       */
      const duration = isNextLight ? 650 : 580;
      const easing = "cubic-bezier(0.35, 0, 0.15, 1)";

      document.documentElement.animate(
        {
          clipPath: [
            `circle(${endRadius}px at ${x}px ${y}px)`,
            `circle(0px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing,
          fill: "forwards",
          pseudoElement: "::view-transition-old(root)",
        }
      );
    }).catch(() => {
      // Ignore transition cancellations (e.g. rapid tapping)
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
