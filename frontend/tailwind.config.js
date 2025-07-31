// File: tailwind.config.js
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx,html}',
    './src/**/*.module.css'      // ← scan your CSS-modules too
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Matter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
