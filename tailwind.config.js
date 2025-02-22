/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // Enables dark mode with 'dark' class
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors (light mode by default)
        primary: "#1E90FF", // Dodger Blue
        secondary: "#00BFFF", // Deep Sky Blue
        background: "#FFFFFF", // White
        card: "#F8F9FA", // Light Gray
        text: "#333333", // Dark Gray
        border: "#E0E0E0", // Light Border
        accent: "#FF4500", // Orange Red
        success: "#34C759", // Green
        warning: "#FF9500", // Orange
        error: "#FF3B30", // Red

        // Dark mode overrides (optional, only if different)
        "dark-background": "#121212", // Dark BG
        "dark-card": "#1E1E1E", // Dark Card
        "dark-text": "#E0E0E0", // Light Text
        "dark-border": "#333333", // Dark Border
      },
    },
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: ["light", "dark"], // Optional: DaisyUI themes
  },
};