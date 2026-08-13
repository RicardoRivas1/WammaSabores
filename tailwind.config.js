/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wamma: {
          bg: '#121214',        // Fondo Carbón / Grafito
          card: '#1E1E22',      // Tarjeta
          gold: '#FFB703',      // Amarillo Ámbar (Logo)
          goldHover: '#F59E0B',
          fire: '#DC2626',      // Rojo Parrilla
          text: '#F5F5F7',      // Blanco texto
          muted: '#9CA3AF',     // Gris secundario
        },
      },
    },
  },
  plugins: [],
}