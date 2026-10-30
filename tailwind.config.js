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
          950: '#450a0a', // Deep Emergency Wine/Red
          900: '#7f1d1d', // Crimson Dark Red
          850: '#991b1b', // Strong Medical Red
          800: '#b91c1c', // SAMU/Rescue Red
          700: '#dc2626', // Vibrant Rescue Red
          600: '#ef4444', // Alert Red
          500: '#f87171', // Bright Red
          100: '#fee2e2', // Soft Red Tint
          50: '#fef2f2',  // Light Red Base
          orange: '#ea580c', // SAMU Rescue Accent Orange
          amber: '#f59e0b'  // SAMU Alert Yellow/Gold
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
