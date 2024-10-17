/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3954DB', 
        secondary: '#222D61',
        white: '#ffffff',
        black: '000000',
        gray: 'EEEEEE',
      },
    },
  },
  plugins: [],

  
}

