import React from 'react';
import { useCart } from '../context/CartContext';

export default function Header({ onOpenCart }) {
  const { cart } = useCart();
  
  // Cuenta cuántos productos hay en total
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-30 bg-neutral-900/90 backdrop-blur-md border-b border-wamma-gold/20 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <h1 className="font-black text-lg text-white">WAMMA SABORES</h1>
      </div>

      {/* BOTÓN DEL CARRITO */}
      <button
        onClick={onOpenCart}
        className="relative p-2.5 bg-wamma-gold/10 border border-wamma-gold/40 rounded-xl text-wamma-gold hover:bg-wamma-gold hover:text-black transition-all flex items-center justify-center"
        aria-label="Ver carrito"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>

        {/* Contador de items en rojo */}
        {totalItems > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-neutral-900 shadow-md">
            {totalItems}
          </span>
        )}
      </button>
    </header>
  );
}