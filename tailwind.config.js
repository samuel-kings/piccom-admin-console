/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        base: '14px',
      },
      colors: {
        dark: {
          bg: '#1A1A26',
          surface: '#242433',
          border: '#2F2F3D'
        }
      }
    },
  },
  plugins: [],
};
