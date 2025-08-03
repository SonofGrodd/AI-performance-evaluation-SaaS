/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx,css}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Euclid Circular A', 'sans-serif'],
      },
      colors: {
        'panel-grad-start': '#0f3446',
        'panel-grad-end': '#155d63',
        'form-bg': '#f0f2f5',
        'primary-dark': '#0f3446',
        'button': '#0f3446',
      },
    },
  },
  plugins: [],
};
