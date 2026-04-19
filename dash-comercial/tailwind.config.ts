import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          main: "#040811",
          card: "#0C1523",
          cardSoft: "#14233A",
        },
        border: {
          card: "#1A2330",
        },
        accent: {
          gold: "#F5B942",
          coral: "#E8724A",
          blue: "#58A6FF",
        },
      },
      borderRadius: {
        card: "20px",
        pill: "99px",
      },
      fontFamily: {
        rajdhani: ["var(--font-rajdhani)"],
        inter: ["var(--font-inter)"],
      },
    },
  },
  plugins: [],
};

export default config;
