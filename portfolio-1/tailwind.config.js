/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        oswald: ['"oswald"', 'sans-serif'], // Replace 'YourFontName' with your font's actual name
        rubik: ['"rubik"', 'sans-serif'],
        newhe :['"newhe"','sans-serif'],
        faltu :['"faltu"','sans-serif'],
        pix :['"pix"','sans-serif'],
      },
      screens: {
        'md': '992px',
        // => @media (min-width: 640px) { ... }
      }  
    },
  },
  plugins: [],
}