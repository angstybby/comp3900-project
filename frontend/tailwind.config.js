/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/line-clamp")],
};
