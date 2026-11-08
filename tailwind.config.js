/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        festive: {
          dark: '#050711',
          darker: '#020307',
          midnight: '#0b0f24',
          navy: '#101738',
          card: 'rgba(15, 23, 50, 0.75)',
          maroon: '#4A0418',
          deepMaroon: '#2C040E',
          gold: {
            DEFAULT: '#E5A93C',
            light: '#FDE047',
            bright: '#FACC15',
            glow: '#FEF08A',
            dim: '#926017',
            warm: '#D97706',
          },
          amber: {
            DEFAULT: '#F59E0B',
            flame: '#FF6B00',
            inner: '#FFF7ED',
          },
          crimson: '#9B1D20',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'flicker': 'flicker 2s infinite ease-in-out',
        'flame-pulse': 'flamePulse 1.8s infinite ease-in-out',
        'float-slow': 'float 6s infinite ease-in-out',
        'glow-pulse': 'glowPulse 3s infinite ease-in-out',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { transform: 'scale(1) rotate(-0.5deg)', opacity: '0.96' },
          '25%': { transform: 'scale(1.05, 0.98) rotate(1deg)', opacity: '1' },
          '50%': { transform: 'scale(0.97, 1.04) rotate(-1deg)', opacity: '0.9' },
          '75%': { transform: 'scale(1.03, 1.01) rotate(0.8deg)', opacity: '1' },
        },
        flamePulse: {
          '0%, 100%': { filter: 'drop-shadow(0 0 16px rgba(245, 158, 11, 0.8)) drop-shadow(0 0 35px rgba(234, 88, 12, 0.5))' },
          '50%': { filter: 'drop-shadow(0 0 25px rgba(251, 191, 36, 0.95)) drop-shadow(0 0 50px rgba(245, 158, 11, 0.7))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.06)' },
        }
      }
    },
  },
  plugins: [],
}
