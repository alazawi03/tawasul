/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['Amiri', 'Lateef', 'Cairo', 'serif'],
        'arabic-title': ['Amiri', 'serif'],
      },
      colors: {
        islamic: {
          gold: '#D4AF37',
          'gold-light': '#F4E4A1',
          'gold-dark': '#B8941F',
          green: '#2D5016',
          'green-light': '#4A7C28',
          'green-dark': '#1A3009',
          beige: '#F5F5DC',
          'beige-light': '#FEFEF2',
          'beige-dark': '#E6E6C7',
          brown: '#8B4513',
          'brown-light': '#A0522D',
          'brown-dark': '#654321',
        }
      },
      backgroundImage: {
        'islamic-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23D4AF37\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      }
    },
  },
  plugins: [],
}
