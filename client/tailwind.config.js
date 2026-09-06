import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["'Newsreader'", "Merriweather", "'Roboto Slab'", "Georgia", "serif"],
        editorial: ["'Newsreader'", "Georgia", "serif"],
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        publication: {
          dark: "#0a0a0c",
          surface: "#121215",
          card: "#18181b",
          border: "#27272a",
          muted: "#71717a",
          accent: "#3b82f6",
        },
        glass: {
          100: "rgba(255, 255, 255, 0.1)",
          200: "rgba(255, 255, 255, 0.2)",
          300: "rgba(255, 255, 255, 0.3)",
        },
      },
      backdropBlur: {
        xs: "2px",
        md: "12px",
        lg: "24px",
        xl: "40px",
      },
    },
  },
  plugins: [typography],
};
