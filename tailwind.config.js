/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2563eb',
          fg: '#1d4ed8',
        },
        status: {
          agendada: '#2563eb',
          concluida: '#16a34a',
          cancelada: '#ef4444',
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}