/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "dark",
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        light: {
          primary: "#93BBFB",
          "primary-content": "#212638",
          secondary: "#DAE8FF",
          "secondary-content": "#212638",
          accent: "#93BBFB",
          "accent-content": "#212638",
          neutral: "#212638",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f4f8ff",
          "base-300": "#DAE8FF",
          "base-content": "#212638",
          info: "#93BBFB",
          success: "#34EEB6",
          warning: "#FFCF72",
          error: "#FF8863",

          "--rounded-btn": "9999rem",

          ".tooltip": {
            "--tooltip-tail": "6px",
          },
          ".link": {
            textUnderlineOffset: "2px",
          },
          ".link:hover": {
            opacity: "80%",
          },
        },
      },
      {
        dark: {
          primary: "#222", // Very dark gray
          secondary: "#333", // Almost dark gray
          accent: "#F87171", // Bright orange

          // Adjust other colors based on your preference (optional):
          "primary-content": "#fff", // White for primary text
          "secondary-content": "#fff", // White for secondary text
          neutral: "#333", // Adjust neutral tones if needed
          "neutral-content": "#fff", // White for neutral text
          "base-100": "#222", // Very dark gray for base background
          "base-200": "#333", // Almost dark gray for base elements
          "base-300": "#444", // Darker shade for base elements (optional)
          "base-content": "#fff", // White for base text
          info: "#F87171", // Accent color for info messages
          success: "#81C784", // Green for success messages
          warning: "#FFD700", // Yellow for warning messages
          error: "#F44336", // Red for error messages
        },
      },
    ],
  },
  theme: {
    extend: {
      spacing: {
        "1/3": "33.33%",
      },
      boxShadow: {
        center: "0 0 12px -2px rgb(0 0 0 / 0.05)",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
