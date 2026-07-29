/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontSize: {
        sm: ['0.825rem', { lineHeight: '1.25rem' }],
      },
      fontFamily: {
        text: ['Poppins', 'sans-serif'], // overrides default sans
        logo: ['Funnel Sans', 'sans-serif'], // optional custom name for app name
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        // 'fade-out': {
        //   '0%': { opacity: 1, transform: 'scale(1)' },
        //   '100%': { opacity: 0, transform: 'scale(0.95)' },
        // },
      },
      animation: {
        'fade-in': 'fade-in 0.15s ease-out forwards',
        // 'fade-out': 'fade-out 0.15s ease-out forwards',
      },
    },
  },
  plugins: [],
};
