import React from 'react';
import { useCart } from '../context/CartContext';

export default function Header({ onOpenCart }) {
  const { cart } = useCart();

  // Esta línea es la que calcula totalItems
  const totalItems = cart ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <header className="sticky top-0 z-30 bg-neutral-900/90 backdrop-blur-md border-b border-wamma-gold/20 px-4 py-3 flex justify-between items-center">
      <h1 className="font-black text-lg text-white">WAMMA SABORES</h1>
      
      <button
        onClick={onOpenCart}
        className="relative p-2.5 bg-wamma-gold/10 border border-wamma-gold/40 rounded-xl text-wamma-gold"
      >
        🛒
        {totalItems > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-neutral-900">
            {totalItems}
          </span>
        )}
      </button>
    </header>
  );
}