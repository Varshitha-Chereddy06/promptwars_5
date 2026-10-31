/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4f5',
          100: '#fce7ea',
          200: '#fad3d9',
          300: '#f5b0bc',
          400: '#ee7f94',
          500: '#e14d6c',
          600: '#cc3355',
          700: '#ab2442',
          800: '#8e213a',
          900: '#771f34',
        },
        champagne: {
          50: '#fbf9f5',
          100: '#f6f2e8',
          200: '#ece2cc',
          300: '#dfcfa7',
          400: '#d1b97e',
          500: '#c5a359',
          600: '#b48c48',
          700: '#966f3b',
          800: '#7b5a34',
          900: '#654b2e',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2.5s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 6s ease infinite',
        'scale-in': 'scale-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slide-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-left': 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'gradient-mesh': 'gradient-mesh 20s ease infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 8px rgba(225,77,108,0.25), 0 0 24px rgba(225,77,108,0.1)',
          },
          '50%': {
            boxShadow: '0 0 16px rgba(225,77,108,0.45), 0 0 48px rgba(225,77,108,0.2)',
          },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-mesh': {
          '0%': { backgroundPosition: '0% 0%, 100% 100%, 50% 50%' },
          '25%': { backgroundPosition: '100% 0%, 0% 100%, 25% 75%' },
          '50%': { backgroundPosition: '100% 100%, 0% 0%, 75% 25%' },
          '75%': { backgroundPosition: '0% 100%, 100% 0%, 50% 50%' },
          '100%': { backgroundPosition: '0% 0%, 100% 100%, 50% 50%' },
        },
      },
      boxShadow: {
        'glow-rose': '0 0 20px rgba(225, 77, 108, 0.3), 0 0 60px rgba(225, 77, 108, 0.1)',
        'glow-amber': '0 0 20px rgba(197, 163, 89, 0.3), 0 0 60px rgba(197, 163, 89, 0.1)',
        'glow-emerald': '0 0 20px rgba(52, 211, 153, 0.3), 0 0 60px rgba(52, 211, 153, 0.1)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        'elevated': '0 20px 40px -12px rgba(0, 0, 0, 0.12), 0 8px 20px -8px rgba(0, 0, 0, 0.08)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        'gradient-mesh-rose': 'radial-gradient(at 0% 0%, rgba(225,77,108,0.12) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(197,163,89,0.12) 0, transparent 50%), radial-gradient(at 50% 50%, rgba(225,77,108,0.06) 0, transparent 70%)',
        'gradient-mesh-champagne': 'radial-gradient(at 20% 80%, rgba(197,163,89,0.15) 0, transparent 50%), radial-gradient(at 80% 20%, rgba(225,77,108,0.1) 0, transparent 50%), radial-gradient(at 50% 50%, rgba(236,226,204,0.2) 0, transparent 60%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
        '2000': '2000ms',
      },
    },
  },
  plugins: [],
}
