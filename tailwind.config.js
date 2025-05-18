/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#c0d6ff',
          300: '#91b8ff',
          400: '#5f94ff',
          500: '#3b70ff',
          600: '#2952ff',
          700: '#1e3bef',
          800: '#1e31c8',
          900: '#1e2d9e',
        },
        indigo: {
          50: '#f0f0ff',
          100: '#e2e1ff',
          200: '#c8c6ff',
          300: '#a49cff',
          400: '#8168ff',
          500: '#6941f6',
          600: '#5b28ef',
          700: '#4e1bd5',
          800: '#3f18ac',
          900: '#341989',
        },
      },
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
};