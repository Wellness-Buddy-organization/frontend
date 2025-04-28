// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'custom-green': {
          100: '#E8F5EC',
          200: '#C7E6D1',
          600: '#489B6E',
          700: '#3D8A5F',
          800: '#2D6344',
        },
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'amaranth': ['Amaranth', 'sans-serif'],
      },
    },
  },
  plugins: [],
};