/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4f5',
          100: '#fce7ea',
          200: '#fad3d9',
          300: '#f5b0bc',
          400: '#ee7f94',
          500: '#e14d6c',
          600: '#cc3355',
          700: '#ab2442',
          800: '#8e213a',
          900: '#771f34',
        },
        champagne: {
          50: '#fbf9f5',
          100: '#f6f2e8',
          200: '#ece2cc',
          300: '#dfcfa7',
          400: '#d1b97e',
          500: '#c5a359',
          600: '#b48c48',
          700: '#966f3b',
          800: '#7b5a34',
          900: '#654b2e',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
