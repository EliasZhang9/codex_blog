/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        primaryContainer: "var(--color-primary-container)",
        primaryFixed: "var(--color-primary-fixed)",
        accent: "var(--color-accent)",
        secondaryContainer: "var(--color-secondary-container)",
        onSecondaryContainer: "var(--color-on-secondary-container)",
        onSurface: "var(--color-on-surface)",
        onSurfaceVariant: "var(--color-on-surface-variant)",
        outlineVariant: "var(--color-outline-variant)",
        surface: "var(--color-surface)",
        surfaceContainerLow: "var(--color-surface-container-low)",
        surfaceContainerLowest: "var(--color-surface-container-lowest)",
        surfaceContainerHigh: "var(--color-surface-container-high)",
        surfaceBright: "var(--color-surface-bright)",
        surfaceDim: "var(--color-surface-dim)"
      },
      fontFamily: {
        display: ["Sora", "Inter", "sans-serif"],
        body: ["Inter", "Sora", "sans-serif"]
      },
      boxShadow: {
        playful: "0 14px 32px rgba(15, 91, 58, 0.12)",
        ambient: "0 28px 64px rgba(10, 54, 36, 0.10)",
        floating: "0 16px 32px rgba(15, 91, 58, 0.16)"
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
        cozy: "20px"
      },
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        20: "5rem",
        24: "6rem"
      }
    },
  },
  plugins: [],
};
