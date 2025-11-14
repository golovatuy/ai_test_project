/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Priority colors
        priority: {
          critical: '#dc2626', // red-600
          high: '#ea580c',     // orange-600
          medium: '#eab308',   // yellow-600
          low: '#16a34a',      // green-600
        }
      }
    },
  },
  plugins: [],
};

