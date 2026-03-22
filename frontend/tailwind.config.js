/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        banana: "#ffe9a3", // softer yellow accent
        mint: "#b9e8ce", // calm green
        sky: "#b8d8ff", // light blue
        coral: "#ffb38a", // warm accent
        grape: "#b7a8e3", // gentle purple accent
        ink: "#1f2d3d" // slightly deeper for contrast
      },
      fontFamily: {
        display: ["Manrope", "Poppins", "sans-serif"],
        body: ["Manrope", "Poppins", "sans-serif"]
      },
      boxShadow: {
        playful: "0 10px 20px rgba(35, 49, 66, 0.16)",
      },
      keyframes: {
        wiggle: {
          "0%,100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" }
        }
      },
      animation: {
        wiggle: "wiggle 1.4s ease-in-out infinite"
      },
      borderRadius: {
        soft: "14px",
        cozy: "18px"
      },
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem"
      }
    },
  },
  plugins: [],
};
