import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#0a120d",
          900: "#0f1d14",
          800: "#183022",
          700: "#244a34",
          600: "#2f6043",
          500: "#3c7a56",
        },
        moss: {
          500: "#5f7f3b",
          400: "#7ea552",
        },
        sand: {
          50: "#fbf7ef",
          100: "#f3eadb",
          200: "#e7d8c3",
          300: "#d6c2a5",
        },
        gold: {
          500: "#c9a35b",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.18)",
        glow: "0 0 0 1px rgba(201,163,91,.25), 0 18px 60px rgba(0,0,0,.35)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(1200px 600px at 20% 10%, rgba(126,165,82,.25), transparent 60%), radial-gradient(900px 500px at 80% 20%, rgba(201,163,91,.18), transparent 55%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
