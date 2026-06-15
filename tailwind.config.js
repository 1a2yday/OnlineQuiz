/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        candy: {
          primary: 'var(--c-primary)',
          'primary-light': 'var(--c-primary-light)',
          secondary: 'var(--c-secondary)',
          'secondary-light': 'var(--c-secondary-light)',
          accent: 'var(--c-accent)',
          highlight: 'var(--c-highlight)',
          bg: 'var(--c-background)',
          card: 'var(--c-card)',
          text: 'var(--c-text)',
          'text-secondary': 'var(--c-text-secondary)',
          'text-muted': 'var(--c-text-muted)',
          'text-light': 'var(--c-text-light)',
          border: 'var(--c-border)',
          'border-strong': 'var(--c-border-strong)',
          'bg-light': 'var(--c-bg-light)',
        },
      },
      boxShadow: {
        'candy': 'var(--c-shadow)',
        'candy-hover': 'var(--c-shadow-hover)',
      },
    },
  },
  plugins: [],
};
