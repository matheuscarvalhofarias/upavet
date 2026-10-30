/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#380000', // Deepest Dark Red
          900: '#520000', // Very Dark Red
          850: '#6e0000', // Rich Dark Red
          800: '#8B0000', // Primary Dark Red #8B0000
          700: '#a30000', // Vivid Dark Red
          600: '#bd0000', // Highlight Red
          500: '#dc2626', // Bright Alert Red
          100: '#ffe5e5', // Soft Tint
          50: '#fff5f5',  // Background Tint
          amber: '#f59e0b' // Accent
        },
        cream: {
          50: '#ffffff',
          100: '#fafafa', // Clean Minimalist Background
          200: '#f4f4f5',
          300: '#e4e4e7',
          border: '#e4e4e7'
        },
        ink: {
          900: '#18181b', // Crisp Dark Slate/Black
          700: '#3f3f46', // Neutral Charcoal
          500: '#71717a', // Muted Neutral
          300: '#a1a1aa'
        }
      }
    }
  },
  plugins: [],
}
