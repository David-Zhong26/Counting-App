import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pc: {
          bg: 'var(--pc-bg)',
          surface: 'var(--pc-surface)',
          surface2: 'var(--pc-surface-2)',
          text: 'var(--pc-text)',
          textSoft: 'var(--pc-text-soft)',
          offwhite: 'var(--pc-offwhite)',
          accent: 'var(--pc-accent)',
          accent2: 'var(--pc-accent-2)',
        },
      },
      boxShadow: {
        neu: '10px 10px 22px var(--pc-shadow-dark), -10px -10px 22px var(--pc-shadow-light)',
        neuSm: '6px 6px 14px var(--pc-shadow-dark), -6px -6px 14px var(--pc-shadow-light)',
        neuInset:
          'inset 6px 6px 14px var(--pc-shadow-dark), inset -6px -6px 14px var(--pc-shadow-light)',
      },
      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.75rem',
      },
      letterSpacing: {
        tightish: '-0.02em',
      },
    },
  },
  plugins: [],
} satisfies Config

