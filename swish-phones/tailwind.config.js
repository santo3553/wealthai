/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          400: '#fb7185',
          500: '#f43f5e', // Sunset Coral
          600: '#e11d48',
          900: '#881337',
        },
        coral: {
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
        peach: {
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
        aurora: {
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
        },
        void: {
          800: '#16192b',
          900: '#0d0f1a',
          950: '#06070d',
        },
        titanium: {
          100: '#f5f5f7',
          200: '#e5e5e7',
          300: '#d2d2d7',
          700: '#3a3a3c',
          800: '#1d1d1f',
          900: '#0b0b0c',
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'aurora-shift': 'aurora-shift 8s ease infinite alternate',
        'shimmer-glint': 'shimmer-glint 3s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'aurora-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'shimmer-glint': {
          '0%': { transform: 'translateX(-100%) rotate(25deg)' },
          '100%': { transform: 'translateX(200%) rotate(25deg)' },
        },
      },
    },
  },
  plugins: [],
};
