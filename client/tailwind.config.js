/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#166534",
        secondary: "#4ade80",
        accent: "#f97316",
      },
    },
  },
  plugins: [],
};
