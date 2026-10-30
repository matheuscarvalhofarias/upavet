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
          950: '#380405', // Deep Dark Red
          900: '#5a0609', // Dark Crimson
          850: '#8b0b0e', // Rich Red
          800: '#a30d10', // Deep Brand Red
          700: '#C21014', // Exact UPAVET Red
          600: '#d9181d', // Bright Tone
          500: '#ea2a2f', // Accent
          100: '#fee2e2', // Soft Red Tint
          50: '#fef2f2',  // Light Red Base
          red: '#C21014', // Primary UPAVET Red
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
