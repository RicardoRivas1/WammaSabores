# Wamma Sabores — Catálogo Digital

SPA mobile-first construida con **React + Vite + Tailwind CSS** para el catálogo/mostrador
digital del restaurante Wamma Sabores (La Candelaria, Caracas).

## Antes de publicar

Edita `src/data/products.js` y reemplaza el número de WhatsApp:

```js
export const WHATSAPP_NUMBER = '584120000000' // <--número real, formato internacional sin "+"
```

## Cómo correr el proyecto

```bash
npm install
npm run dev       # entorno de desarrollo (http://localhost:5173)
npm run build     # genera la versión de producción en /dist
npm run preview   # sirve localmente el build de producción
```

## Estructura

```
src/
  components/
    Header.jsx        Marca, subtítulo y buscador
    CategoryNav.jsx    Barra de categorías pegajosa
    ProductCard.jsx    Tarjeta individual de producto
    ProductGrid.jsx    Grilla + estado vacío
    WhatsAppFab.jsx    Botón flotante de WhatsApp
    EmberField.jsx     Partículas de brasa animadas (header)
  data/
    products.js        Categorías, productos y número de WhatsApp
  utils/
    whatsapp.js         Helpers para armar los links de wa.me
  App.jsx               Composición + lógica de filtrado/búsqueda
  index.css             Directivas Tailwind + utilidades propias
tailwind.config.js       Paleta, tipografías y animaciones del tema
```

## Despliegue

El proyecto genera un `dist/` estático tras `npm run build`, listo para subir a
Netlify, Vercel, GitHub Pages o cualquier hosting estático.
