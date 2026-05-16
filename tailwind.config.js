/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // Neon Green — Primary accent
        neon: {
          50: '#edfff5',
          100: '#d5ffea',
          200: '#aeffd6',
          300: '#70ffb6',
          400: '#39ff8e',
          500: '#00ff6a',  // Main neon green
          600: '#00cc55',
          700: '#009940',
          800: '#007733',
          900: '#00632b',
        },
        // Dark surface tones
        surface: {
          DEFAULT: '#0a0a0a',
          50: '#171717',
          100: '#1a1a1a',
          200: '#1f1f1f',
          300: '#262626',
          400: '#333333',
          500: '#4a4a4a',
        },
      },
      boxShadow: {
        'neon': '0 0 10px rgba(0, 255, 106, 0.3), 0 0 20px rgba(0, 255, 106, 0.1)',
        'neon-lg': '0 0 20px rgba(0, 255, 106, 0.4), 0 0 40px rgba(0, 255, 106, 0.15)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scan-line 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 255, 106, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(0, 255, 106, 0.6)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0%)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
