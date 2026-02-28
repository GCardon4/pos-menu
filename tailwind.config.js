/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#11d4c4',
        'primary-dark': '#0fa99c',
        'primary-light': '#a1f0eb',
        'background-light': '#f8fafc', // Light slate
        'sidebar-light': '#ffffff',
        'border-accent': '#e2e8f0', // Light slate border
        'background-dark': '#111821', // Keeping it for fallback or explicit dark usage, though standardizing on light
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        sans: ['Work Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
