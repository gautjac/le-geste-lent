/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: ["class", '[data-theme="nuit"]'],
  theme: {
    extend: {
      colors: {
        // Le Geste Lent — ink on rice paper by day, a still pond at dawn by night.
        // Tokens are CSS variables so day/night swap with one attribute on <html>.
        paper: "rgb(var(--paper) / <alpha-value>)", // ground
        leaf: "rgb(var(--leaf) / <alpha-value>)", // raised surface (cards)
        sumi: "rgb(var(--sumi) / <alpha-value>)", // ink — figures + text
        "sumi-soft": "rgb(var(--sumi-soft) / <alpha-value>)", // secondary ink
        "sumi-faint": "rgb(var(--sumi-faint) / <alpha-value>)", // hairlines, ghosts
        celadon: "rgb(var(--celadon) / <alpha-value>)", // the single living accent
        "celadon-deep": "rgb(var(--celadon-deep) / <alpha-value>)",
        vermilion: "rgb(var(--vermilion) / <alpha-value>)", // reserved: just-unlocked
        breath: "rgb(var(--breath) / <alpha-value>)", // breath ring / haptic pulse
      },
      fontFamily: {
        serif: ['"Spectral"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      letterSpacing: {
        wider2: "0.14em",
        wide3: "0.22em",
      },
      boxShadow: {
        rise: "0 1px 2px rgba(0,0,0,0.03), 0 8px 28px -16px rgba(0,0,0,0.18)",
      },
      transitionTimingFunction: {
        breath: "cubic-bezier(0.37, 0, 0.18, 1)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        breathe: {
          "0%, 100%": { transform: "scale(0.86)", opacity: "0.5" },
          "50%": { transform: "scale(1.08)", opacity: "1" },
        },
        drawIn: { "0%": { strokeDashoffset: "1" }, "100%": { strokeDashoffset: "0" } },
      },
      animation: {
        fadeUp: "fadeUp 0.6s cubic-bezier(0.37,0,0.18,1) both",
        fadeIn: "fadeIn 0.8s ease-out both",
        breathe: "breathe 3s cubic-bezier(0.37,0,0.18,1) infinite",
      },
    },
  },
  plugins: [],
};
