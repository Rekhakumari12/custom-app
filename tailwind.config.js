/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        romance: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
        },
        pastel: {
          pink: "#FFD1DC",
          peach: "#FFDAB9",
          lavender: "#E6E6FA",
        },
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
        },
        fallDown: {
          "0%": { transform: "translateY(-100vh)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "gradient-animation": {
          "0%": {
            backgroundPosition: "0% 50%",
            backgroundColor: "#ff66a3", // Start with light pink
          },
          "50%": {
            backgroundPosition: "100% 50%",
            backgroundColor: "#9b59b6", // Transition to purple/violet
          },
          "100%": {
            backgroundPosition: "0% 50%",
            backgroundColor: "#34d399", // End with light green
          },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        heartbeat: "heartbeat 1s ease-in-out infinite",
        fallDown: "fallDown 3s linear infinite",
        gradient: "gradient-animation 30s ease infinite",
      },
    },
  },
  plugins: [],
};
