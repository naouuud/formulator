/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './projects/formulator-builder/src/**/*.{html,ts}',
    './projects/formulator-responder/src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      fontSize: {
        sm: ['0.825rem', { lineHeight: '1.25rem' }],
      },
    },
  },
  plugins: [],
};
