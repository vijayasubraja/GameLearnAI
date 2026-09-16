/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gl: {
          bg: '#0B0E14',
          surface: '#11151D',
          raised: '#171C26',
          overlay: '#0F1320',
          border: '#1F2734',
          borderStrong: '#2C3646',
        },
        primary: {
          DEFAULT: '#3D7BFF',
          hover: '#2E66E8',
          active: '#2554C4',
          subtle: 'rgba(61, 123, 255, 0.12)',
          text: '#9CB8FF',
        },
        success: {
          DEFAULT: '#22C55E',
          hover: '#1EAA51',
          subtle: 'rgba(34, 197, 94, 0.12)',
          text: '#6FD99A',
        },
        warning: {
          DEFAULT: '#F59E0B',
          hover: '#DE8B00',
          subtle: 'rgba(245, 158, 11, 0.12)',
          text: '#FFC972',
        },
        danger: {
          DEFAULT: '#EF4444',
          hover: '#D63C3C',
          subtle: 'rgba(239, 68, 68, 0.12)',
          text: '#F8A3A3',
        },
        ink: {
          high: '#F2F5FA',
          mid: '#A6AEBD',
          low: '#6B7484',
          faint: '#3A4150',
          disabled: '#2A303C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 1px 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
        'panel-hover': '0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 32px -12px rgba(0,0,0,0.7)',
        ring: '0 0 0 3px rgba(61, 123, 255, 0.35)',
        'ring-success': '0 0 0 3px rgba(34, 197, 94, 0.28)',
        'ring-danger': '0 0 0 3px rgba(239, 68, 68, 0.28)',
      },
      backgroundImage: {
        'gl-grid':
          'linear-gradient(to right, rgba(148, 163, 184, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.05) 1px, transparent 1px)',
        'gl-radial':
          'radial-gradient(1200px 600px at 50% -10%, rgba(61, 123, 255, 0.09), transparent 60%)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out both',
        'slide-up': 'slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in-left': 'slide-in-left 0.25s ease-out both',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};