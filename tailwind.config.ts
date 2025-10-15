import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#c0a891",
          100: "#b6977d",
          200: "#b7825f",
          500: "#774e32",
          600: "#6f4e37",
          700: "#543626",
        },
      },
      boxShadow: {
        soft: "0 10px 30px -15px rgba(111, 78, 55, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
