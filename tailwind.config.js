/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Qui puoi estendere il tema se necessario
      // Le animazioni personalizzate sono già nel CSS, quindi qui non servono
    },
  },
  plugins: [],
}
