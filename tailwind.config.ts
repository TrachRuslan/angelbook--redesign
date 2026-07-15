import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        charcoal: {
          950: "#0a0a0b",
          900: "#0f0f11",
          800: "#141416",
          700: "#1a1a1e",
          600: "#222226",
        },
        ivory: {
          50: "#faf9f6",
          100: "#f5f4f0",
          200: "#e8e6e0",
          300: "#d4d1c8",
        },
        gold: {
          400: "#d4bc7a",
          500: "#c4a962",
          600: "#b89b4a",
          700: "#9a7f3a",
        },
      },
      borderRadius: {
        elegant: "16px",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(196, 169, 98, 0.08)",
        "soft-hover": "0 8px 32px -4px rgba(196, 169, 98, 0.14)",
      },
    },
  },
  plugins: [],
};

export default config;
