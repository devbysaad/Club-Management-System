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
      },
      colors: {
        // Real Madrid Professional Palette
        rmBlue: "#00529F",          // Primary - Real Madrid Blue
        rmBlueDark: "#003D7A",       // Darker blue for hover states
        rmBlueLight: "#0066CC",      // Lighter blue for accents
        rmGold: "#C9A961",           // Gold accent (limited use)
        rmGoldDark: "#B89851",       // Darker gold
        rmGoldLight: "#D4B571",      // Lighter gold
        rmWhite: "#FFFFFF",          // Pure white
        rmGray: {
          50: "#FAFAFA",             // Lightest gray - page backgrounds
          100: "#F5F5F5",            // Light gray - section backgrounds
          200: "#E5E5E5",            // Borders
          300: "#D4D4D4",            // Subtle borders
          400: "#A3A3A3",            // Disabled states
          500: "#737373",            // Secondary text
          600: "#525252",            // Icons
          700: "#404040",            // Body text
          800: "#262626",            // Headings
          900: "#1A1A1A",            // Primary text
        },
        // Legacy color mappings for compatibility
        fcNavy: "#FFFFFF",
        fcNavyLight: "#F5F5F5",
        fcNavyDark: "#FAFAFA",
        fcGarnet: "#00529F",
        fcGarnetLight: "#0066CC",
        fcGarnetDark: "#003D7A",
        fcBlue: "#00529F",
        fcBlueLight: "#0066CC",
        fcBlueDark: "#003D7A",
        fcGold: "#C9A961",
        fcGoldLight: "#D4B571",
        fcGoldDark: "#B89851",
        fcGreen: "#00A64E",
        fcGreenLight: "#00C95E",
        fcSurface: "#FFFFFF",
        fcSurfaceLight: "#F5F5F5",
        fcSurfaceDark: "#FAFAFA",
        fcText: "#1A1A1A",
        fcTextMuted: "#737373",
        fcTextDim: "#A3A3A3",
        fcBorder: "#E5E5E5",
        lamaSky: "#00529F",
        lamaSkyLight: "#F5F5F5",
        lamaPurple: "#00529F",
        lamaPurpleLight: "#F5F5F5",
        lamaYellow: "#C9A961",
        lamaYellowLight: "#FAFAFA",
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
      },
      fontFamily: {
        heading: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
