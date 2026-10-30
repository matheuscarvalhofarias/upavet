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
          950: '#2b0000', // Deep Dark Wine
          900: '#4a0000', // Deep Crimson Dark
          850: '#680000', // Dark Maroon
          800: '#750000', // Darker Red
          700: '#8B0000', // Exact DarkRed (#8B0000)
          600: '#a30000', // Hover DarkRed
          500: '#b80000', // Bright Accent
          100: '#fee2e2', // Soft Red Tint
          50: '#fef2f2',  // Light Red Base
          red: '#8B0000', // Primary UPAVET Red
          amber: '#f59e0b'
        },
        cream: {
          50: '#fcfdfd',
          100: '#f8fafc', // Clean Clinical Base
          200: '#f1f5f9', // Slate soft contrast
          300: '#e2e8f0', // Border subtle
          border: '#e2e8f0'
        },
        ink: {
          900: '#0f172a', // Clean Deep Navy/Black
          700: '#334155', // Slate Text
          500: '#64748b', // Muted Slate
          300: '#94a3b8'
        }
      }
    }
  },
  plugins: [],
}
