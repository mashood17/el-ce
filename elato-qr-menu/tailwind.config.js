/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#EBD8B7",
          pattern: "#EEDDBF",
          gold: "#9E7519",
          accent: "#B09779",
          dark: "#2C1A00",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["DM Sans", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxury: "0.2em",
        "luxury-wide": "0.35em",
      },
    },
  },
  plugins: [],
};