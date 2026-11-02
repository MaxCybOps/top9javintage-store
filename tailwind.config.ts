import type { Config } from 'tailwindcss';
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { ink: '#22231f', amber: '#e9a62a', paper: '#fafaf7', muted: '#74756f' },
    fontFamily: { sans: ['DM Sans', 'sans-serif'], display: ['Barlow Condensed', 'sans-serif'] },
  } }, plugins: [],
} satisfies Config;
