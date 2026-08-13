import React from "react";

export default function ProductCard({ product, index, onAddToCart }) {
  return (
    <article className="bg-wamma-card rounded-2xl overflow-hidden border border-wamma-gold/10 shadow-lg flex flex-col justify-between">
      <div>
        {/* Imagen & Badge */}
        <div className="relative h-44 w-full overflow-hidden bg-wamma-bg">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-wamma-card via-transparent to-black/40"></div>

          {product.badge && (
            <span className="absolute top-3 left-3 bg-wamma-fire/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-md">
              {product.badge}
            </span>
          )}

          <span className="absolute bottom-3 right-3 bg-wamma-bg/90 backdrop-blur-md text-wamma-gold text-base font-black px-3 py-1 rounded-xl border border-wamma-gold/30">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Info */}
        <div className="p-4">
          <h2 className="text-base font-black text-white mb-1 flex items-center gap-2">
            <span>{product.name}</span>
            <span className="text-xs">{product.emoji}</span>
          </h2>
          <p className="text-xs text-wamma-muted leading-relaxed">
            {product.desc}
          </p>
        </div>
      </div>

      {/* Botón con SVG nativo (sin lucide-react) */}
      <div className="px-4 pb-4 pt-1">
        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-wamma-gold/10 hover:bg-wamma-gold text-wamma-gold hover:text-black border border-wamma-gold/30 font-black text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          <span>Pedir por WhatsApp</span>
        </button>
      </div>
    </article>
  );
}