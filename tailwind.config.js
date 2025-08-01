/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./src/pages/**/*.vue",
    "./src/components/**/*.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ac',
          300: '#f6bb77',
          400: '#f19540',
          500: '#ed7318',
          600: '#de5a0e',
          700: '#b8440e',
          800: '#933814',
          900: '#772f14',
          950: '#401609'
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        }
      },
      fontFamily: {
        sans: ['PingFang SC', 'Helvetica Neue', 'Arial', 'sans-serif']
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.15)'
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  }
} 