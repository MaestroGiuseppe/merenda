export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

Senza questo file, Vercel non sa come leggere le righe `@tailwind` e blocca tutto.
