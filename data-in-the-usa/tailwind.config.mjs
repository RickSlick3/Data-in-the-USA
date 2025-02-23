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
        lightHover: '#aeb6f1',
        darkHover: '#8193e9',
        'orange-0': '#fcb34d',
        'orange-1': '#f9aa33',
        'orange-2': '#ffbd65',
        'gray-0': '#4a6572',
        'gray-1': '#344955',
        'gray-2': '#232f34',
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