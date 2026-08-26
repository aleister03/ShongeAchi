/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.5rem" }], // was 0.75rem/1rem
        sm: ["1rem", { lineHeight: "1.85rem" }], // was 0.875rem/1.25rem
      },
    },
  },
  plugins: [],
};