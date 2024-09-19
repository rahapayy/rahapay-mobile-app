/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#5136C1",
        surface: {
          primary: "#F3F4F5",
          secondary: "#F7F7F7",
          tertiary: "#F2F2F7",
        },
        border: {
          200: "#DFDFDF",
        },
        grey: {
          200: "#AEAEB2",
        },
        success: {
          DEFAULT: "#67D04D",
        },
      },
    },
  },
  plugins: [],
};
