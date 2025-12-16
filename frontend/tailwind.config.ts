import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "fc-gradient": "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        "card-gradient": "linear-gradient(145deg, rgba(164, 0, 68, 0.15) 0%, rgba(0, 77, 152, 0.15) 100%)",
      },
      colors: {
        // FC Barcelona Inspired Colors
        fcNavy: "#1a1a2e",
        fcNavyLight: "#16213e",
        fcNavyDark: "#0f0f1a",
        fcGarnet: "#a50044",
        fcGarnetLight: "#c41e5c",
        fcGarnetDark: "#8a0038",
        fcBlue: "#004d98",
        fcBlueLight: "#0066cc",
        fcBlueDark: "#003d7a",
        fcGold: "#edbb00",
        fcGoldLight: "#ffd700",
        fcGoldDark: "#c99a00",
        fcGreen: "#00a64e",
        fcGreenLight: "#00c95e",
        // Neutral colors for dark theme
        fcSurface: "#1e1e32",
        fcSurfaceLight: "#2a2a42",
        fcSurfaceDark: "#141424",
        fcText: "#ffffff",
        fcTextMuted: "#a0a0b0",
        fcTextDim: "#6b6b80",
        fcBorder: "#3a3a52",
        // Legacy colors (kept for compatibility)
        lamaSky: "#004d98",
        lamaSkyLight: "#16213e",
        lamaPurple: "#a50044",
        lamaPurpleLight: "#2a2a42",
        lamaYellow: "#edbb00",
        lamaYellowLight: "#1e1e32",
      },
      boxShadow: {
        'glow-garnet': '0 0 20px rgba(165, 0, 68, 0.3)',
        'glow-blue': '0 0 20px rgba(0, 77, 152, 0.3)',
        'glow-gold': '0 0 20px rgba(237, 187, 0, 0.3)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.4)',
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
