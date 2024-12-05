/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", // Include the root App file
    "./src/**/*.{js,jsx,ts,tsx}", // Include all files in the `src` directory
  ],
  theme: {
    extend: {}, // Extend Tailwind defaults here
  },
  plugins: [], // Add Tailwind plugins if needed
};
