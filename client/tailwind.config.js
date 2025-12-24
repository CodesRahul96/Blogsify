import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "San Francisco",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
        inter: ["Inter", "sans-serif"],
        merriweather: ["Merriweather", "serif"],
        poppins: ["Poppins", "sans-serif"],
        "roboto-slab": ["Roboto Slab", "serif"],
      },
      colors: {
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
