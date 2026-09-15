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
        game: {
          bg: "#0B0F19",
          card: "rgba(18, 24, 40, 0.75)",
          border: "rgba(255, 255, 255, 0.08)",
          accent: "#6366F1",
          accentHover: "#4F46E5",
          neonCyan: "#06B6D4",
          neonEmerald: "#10B981",
          neonAmber: "#F59E0B",
          neonRose: "#F43F5E",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-indigo': '0 0 25px -5px rgba(99, 102, 241, 0.4)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.4)',
      },
    },
  },
  plugins: [],
}
