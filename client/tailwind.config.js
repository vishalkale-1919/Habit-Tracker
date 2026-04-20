/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "cyber-bg": "var(--bg-main)",
        "cyber-panel": "var(--bg-panel)",
        "cyber-border": "var(--color-border)",
        "cyber-cyan": "#00f2ff",
        "cyber-green": "#00ff41",
        "cyber-red": "#ff3860",
        "cyber-amber": "#ffb000",
        "cyber-muted": "#5b6b80",
      },
    },
    fontFamily: {
      mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      display: ['"Orbitron"', "system-ui", "sans-serif"],
    },
    boxShadow: {
      neon: "0 0 12px rgba(0,242,255,.6), inset 0 0 8px rgba(0,242,255,.15)",
      "neon-green": "0 0 14px rgba(0,255,65,.6)",
      "neon-red": "0 0 14px rgba(255,56,96,.55)",
    },
    keyframes: {
      flicker: {
        "0%,100%": { opacity: 1 },
        "50%": { opacity: 0.85 },
      },
      scan: {
        "0%": { transform: "translateY(-100%)" },
        "100%": { transform: "translateY(100%)" },
      },
    },
    animation: {
      flicker: "flicker 2s infinite",
      scan: "scan 4s linear infinite",
    },
  },
};
plugins: [];
