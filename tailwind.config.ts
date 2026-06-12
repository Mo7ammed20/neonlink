import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neon Palette
        neon: {
          blue:   "#00BFFF",
          purple: "#8A2BE2",
          pink:   "#FF007F",
          green:  "#00FF88",
          yellow: "#FFD700",
        },
        // Dark Backgrounds
        dark: {
          base:    "#0A0A0F",
          card:    "#0F0F1A",
          surface: "#12121F",
          elevated:"#161625",
          border:  "rgba(0, 191, 255, 0.15)",
        },
        // Custom Grays
        slate: {
          850: "#0F172A",
          950: "#0A0A0F",
        },
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        body:    ["Space Grotesk", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
        sans:    ["Space Grotesk", "sans-serif"],
      },
      backgroundImage: {
        "neon-gradient":  "linear-gradient(135deg, #00BFFF, #8A2BE2)",
        "neon-gradient-r":"linear-gradient(135deg, #8A2BE2, #00BFFF)",
        "dark-gradient":  "linear-gradient(180deg, #0A0A0F 0%, #0F0F1A 100%)",
        "glow-radial":    "radial-gradient(circle, rgba(0, 191, 255, 0.1) 0%, transparent 70%)",
        "grid-lines":     "linear-gradient(rgba(0,191,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,191,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "50px 50px",
        "400%": "400% 400%",
      },
      boxShadow: {
        "neon-sm":    "0 0 10px rgba(0, 191, 255, 0.3)",
        "neon-md":    "0 0 20px rgba(0, 191, 255, 0.3), 0 0 40px rgba(0, 191, 255, 0.1)",
        "neon-lg":    "0 0 30px rgba(0, 191, 255, 0.5), 0 0 60px rgba(0, 191, 255, 0.2)",
        "neon-purple":"0 0 20px rgba(138, 43, 226, 0.3), 0 0 40px rgba(138, 43, 226, 0.1)",
        "glass":      "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        "card-hover": "0 0 25px rgba(0, 191, 255, 0.2), 0 8px 32px rgba(0, 0, 0, 0.4)",
        "input-focus":"0 0 0 3px rgba(0, 191, 255, 0.15), 0 0 20px rgba(0, 191, 255, 0.1)",
      },
      animation: {
        "gradient-shift": "gradientShift 6s ease infinite",
        "float":          "float 3s ease-in-out infinite",
        "pulse-neon":     "pulse-neon 2s ease-in-out infinite",
        "shimmer":        "shimmer 1.5s infinite",
        "slide-up":       "slideUp 0.3s ease-out",
        "fade-in":        "fadeIn 0.5s ease-out",
        "matrix-rain":    "matrix-rain 3s linear infinite",
        "scanline":       "scanline 8s linear infinite",
      },
      keyframes: {
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":       { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-10px)" },
        },
        "pulse-neon": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(0, 191, 255, 0.4)" },
          "50%":       { boxShadow: "0 0 20px rgba(0, 191, 255, 0.8)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        slideUp: {
          from: { transform: "translateY(20px)", opacity: "0" },
          to:   { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backdropBlur: {
        xs: "2px",
      },
      transitionTimingFunction: {
        "bounce-in":  "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "ease-spring":"cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [animate],
};

export default config;
