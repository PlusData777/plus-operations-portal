import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#1d3557",
        plusSlate: "#334155",
        emerald: "#16a34a",
        crimson: "#dc2626",
        canvas: "#f8fafc"
      },
      boxShadow: {
        panel: "0 18px 50px rgba(29, 53, 87, 0.09)",
        lift: "0 12px 30px rgba(29, 53, 87, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
