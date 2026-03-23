/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        chat: {
          bg: '#0d0d0d',
          sidebar: '#171717',
          input: '#2f2f2f',
          hover: '#212121',
          border: '#2f2f2f',
          user: '#2f2f2f',
          assistant: '#171717',
        },
      },
    },
  },
  plugins: [],
};
