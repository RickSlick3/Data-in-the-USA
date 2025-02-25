/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-red': '#c62828',
        'custom-blue': '#1565c0',
        'custom-white': '#f7f7f7',
        'light-surface': '#999999',
        'dark-surface': '#252525',
      },
      textOpacity: {
        '87': '0.87',
        '60': '0.60',
        '38': '0.38',
      },
      fontFamily: {
        Outfit: ["Outfit", "sans-serif"],
        Ovo: ["Ovo", "serif"],
      },
      boxShadow: {
        'black': '3px 3px 0 #000', 
        'white': '3px 3px 0 #fff',
      }
    },
    gridTemplateColumns: {
      'auto': 'repeat(auto-fit, minmax(200px, 1fr))',
    }
  },
  plugins: [],
};