/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        text: ['Poppins', 'sans-serif'], // overrides default sans
        logo: ['Funnel Sans', 'sans-serif'], // optional custom name for app name
      },
    },
  },
  plugins: [],
};
