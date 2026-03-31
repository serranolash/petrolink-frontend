/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'safety-green': '#1a472a',
        'warning-red': '#c62828',
        'warning-yellow': '#f9a825',
      },
    },
  },
  plugins: [],
}
