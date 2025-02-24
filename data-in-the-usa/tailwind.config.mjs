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
        'primary': '#bb86fc',
        'primary-variant': '#3700b3',
        'secondary': '#03dac6',
        'background': '#121212',
        'surface': '#282828',
        'surface-light': '#3f3f3f',
        'error': '#cf6679',
        'on-primary': '#000000',
        'on-secondary': '#000000',
        'on-background': '#ffffff',
        'on-surface': '#ffffff',
        'on-error': '#000000',
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