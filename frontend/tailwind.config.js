/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0B0F1A',
        mist: '#9CA3AF',
        brand: {
          50: '#ECFEFF', 100: '#CFFAFE', 200: '#A5F3FC', 300: '#67E8F9',
          400: '#22D3EE', 500: '#06B6D4', 600: '#0891B2', 700: '#0E7490', 800: '#155E75', 900: '#164E63'
        }
      },
      boxShadow: {
        soft: '0 10px 40px rgba(2,8,23,0.35)'
      },
    },
  },
  plugins: [],
}

