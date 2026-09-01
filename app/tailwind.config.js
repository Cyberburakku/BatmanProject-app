/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Javet's brand palette (see /DESIGN.md)
        blue: { DEFAULT: '#00A3FF', 600: '#0089d8', 700: '#006fb0' },
        fire: { DEFAULT: '#FF6B00', 600: '#e05e00' },
        gold: { DEFAULT: '#FFD700', 600: '#d9b700' },
        navy: {
          900: '#0A0E1A',
          800: '#111726',
          700: '#1a2233',
          600: '#243046',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['"SF Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(0,163,255,.35), 0 8px 30px -8px rgba(0,163,255,.35)',
      },
    },
  },
  plugins: [],
}
