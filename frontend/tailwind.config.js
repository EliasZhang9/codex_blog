/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        banana: "#ffe66d",
        mint: "#b8f2d6",
        sky: "#9fd8ff",
        coral: "#ff8e72",
        grape: "#b185db",
        ink: "#233142"
      },
      fontFamily: {
        display: ["Fredoka", "Poppins", "sans-serif"],
        body: ["Comic Neue", "Poppins", "sans-serif"]
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
      }
    },
  },
  plugins: [],
};
