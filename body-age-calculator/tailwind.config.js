/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5300b7',
        'accent-red': '#ff4b4b',
        'accent-green': '#58cc02',
        'accent-orange': '#ff9600',
        'accent-blue': '#1cb0f6',
        cta: '#ff845e',
        'cta-border': '#e56a47',
        bg: '#fcf9f4',
        'app-text': '#4b4b4b',
        'text-muted': '#6b7280',
        'text-light': '#afafaf',
        'app-border': '#e5e5e5',
      },
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
