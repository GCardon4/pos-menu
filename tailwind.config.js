/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1978e5',
        'primary-dark': '#b3e600',
        'background-light': '#f6f7f8',
        'sidebar-light': '#e8eaed',
        'border-accent': '#ccff00',
        'background-dark': '#111821',
      },
      fontFamily: {
        display: 'Inter',
        sans: ['Work Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
