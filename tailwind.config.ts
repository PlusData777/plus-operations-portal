/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#1b365d",
          "navy-dark": "#122440",
          yellow: "#fad207",
          rust: "#c65a28",
          ochre: "#e59a24",
          red: "#b82626",
        },
      },
    },
  },
  plugins: [],
};
