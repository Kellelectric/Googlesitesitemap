import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        petrol: {
          DEFAULT: '#13322C',
          700: '#0E2621',
          600: '#1B4038',
          500: '#245349',
        },
        yellow: {
          DEFAULT: '#F5B700',
        },
        orange: {
          DEFAULT: '#F06000',
        },
        paper: '#F7F5F0',
        ink: '#0E1712',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      maxWidth: {
        content: '1280px',
      },
      borderRadius: {
        DEFAULT: '4px',
      },
      backgroundImage: {
        'circuit-grid':
          'linear-gradient(rgba(247,245,240,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(247,245,240,0.06) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
      keyframes: {
        'reveal-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          // Distance is set per-instance via the --marquee-distance CSS
          // variable (measured in JS to exactly one set's width) — see
          // PartnerLogos.tsx. The 50% fallback only matters for the one
          // frame before that measurement effect runs.
          '100%': { transform: 'translateX(calc(-1 * var(--marquee-distance, 50%)))' },
        },
      },
      animation: {
        'reveal-up': 'reveal-up 0.6s ease-out forwards',
        // Duration is overridden per-instance (scales with logo count) via
        // an inline style — see PartnerLogos.tsx. This default only applies
        // if that's ever omitted.
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
export default config
