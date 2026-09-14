import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f4fd",
          100: "#e0e9fb",
          200: "#c7d7f7",
          300: "#a0bdf1",
          400: "#709be9",
          500: "#4b77df",
          600: "#345bc7",
          700: "#2a46a2",
          800: "#263c83",
          900: "#1e2c5e",
          950: "#0e152f",
        },
        accent: {
          50: "#fbf8f1",
          100: "#f4eddd",
          200: "#ebd9b8",
          300: "#dfbf8e",
          400: "#d3a466",
          500: "#c88c45",
          600: "#ba7539",
          700: "#9b5a30",
          800: "#7d482c",
          900: "#653b26",
          950: "#361c12",
        },
        risk: {
          high: "#e11d48",
          "high-bg": "#fff1f2",
          "high-border": "#fecdd3",
          medium: "#d97706",
          "medium-bg": "#fffbeb",
          "medium-border": "#fde68a",
          low: "#0284c7",
          "low-bg": "#f0f9ff",
          "low-border": "#bae6fd",
          info: "#059669",
          "info-bg": "#ecfdf5",
          "info-border": "#a7f3d0",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["Merriweather", "Georgia", "Cambria", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
