/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0F1E36",
          navyDark: "#0A1424",
          navyLight: "#1E3A5F",
          red: "#D9232D",
          redDark: "#B81D26",
          redLight: "#FEE2E2",
          blue: "#2A4365",
          canvas: "#F8F9FA",
          card: "#FFFFFF",
          border: "#E2E8F0",
          text: "#1F242E",
          muted: "#64748B",
        },
      },
      fontFamily: {
        cairo: ["var(--font-cairo)", "Cairo", "sans-serif"],
        tajawal: ["var(--font-tajawal)", "Tajawal", "sans-serif"],
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.4, transform: "scale(1.2)" },
        },
      },
      animation: {
        ticker: "ticker 35s linear infinite",
        pulseGlow: "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
