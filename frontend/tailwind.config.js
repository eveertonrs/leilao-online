/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3f51b5', // Indigo
        'secondary': '#7986cb', // Indigo lighten
        'accent': '#e91e63', // Rosa
        'background': '#fafafa', // Cinza claro
        'card': '#ffffff',
        'text-primary': '#212121',
        'text-secondary': '#757575',
      },
      fontFamily: {
        'sans': ['Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0px 3px 5px rgba(0,0,0,0.2)',
      }
    },
  },
  plugins: [],
}
