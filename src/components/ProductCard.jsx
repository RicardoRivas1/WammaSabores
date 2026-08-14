import React from 'react';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between p-4 relative shadow-md">
      {/* Imagen con fallback (se oculta si no existe o falla al cargar) */}
      {product.image && (
        <div className="w-full h-40 overflow-hidden rounded-lg mb-3 bg-zinc-800">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.parentElement.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Contenido principal del producto */}
      <div className="flex-1">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-white font-bold text-lg leading-snug">
            {product.name}
          </h3>
          <span className="bg-amber-500/10 text-amber-400 font-extrabold px-2.5 py-1 rounded-md text-sm whitespace-nowrap">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {product.description && (
          <p className="text-zinc-400 text-xs line-clamp-2 mb-4">
            {product.description}
          </p>
        )}
      </div>

      {/* Botón para agregar al carrito */}
      <button
        onClick={() => onAddToCart(product)}
        className="w-full mt-2 py-2.5 px-4 bg-zinc-800 hover:bg-amber-500 hover:text-black text-amber-400 font-semibold text-sm rounded-lg transition-colors duration-200 flex items-center justify-center gap-1.5 border border-zinc-700/50"
      >
        <span>+</span> Agregar al Carrito
      </button>
    </div>
  );
}