/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-primary": "#131517",
        "custom-secondary": "#1A1B20",
      },
    },
  },
  plugins: [],
};
