// src/components/CartDrawer.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { sendOrderToWhatsApp } from '../utils/whatsapp';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    tasaBcv,
    totalUSD,
    totalVES,
  } = useCart();

  const [notes, setNotes] = useState('');

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    sendOrderToWhatsApp({ cart, totalUSD, totalVES, tasaBcv, notes });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-wamma-card h-full flex flex-col border-l border-wamma-gold/20 shadow-2xl">
        {/* Header Drawer */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-wamma-bg">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              🛒 Tu Carrito
            </h2>
            <p className="text-[11px] text-wamma-gold font-semibold">
              Tasa BCV del día: Bs. {tasaBcv.toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-wamma-muted hover:text-white text-xl font-bold p-1"
          >
            ✕
          </button>
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-wamma-muted">
              <p className="text-3xl mb-2">🛍️</p>
              <p className="text-sm font-medium">Tu carrito está vacío.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-wamma-bg p-3 rounded-xl border border-white/5 flex items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <p className="text-xs text-wamma-gold font-extrabold">
                    ${item.price.toFixed(2)}{' '}
                    <span className="text-wamma-muted font-normal">
                      (Bs. {(item.price * tasaBcv).toFixed(2)})
                    </span>
                  </p>
                </div>

                {/* Controles de Cantidad */}
                <div className="flex items-center gap-2 bg-wamma-card px-2 py-1 rounded-lg border border-white/10">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="text-wamma-gold font-black px-1.5 hover:text-white"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-white w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="text-wamma-gold font-black px-1.5 hover:text-white"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 hover:text-red-300 text-xs px-1"
                  title="Eliminar"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer del Carrito con Totales y Botón de Envío */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-white/10 bg-wamma-bg space-y-3">
            {/* Notas opcionales */}
            <input
              type="text"
              placeholder="Ej: Sin cebolla, extra salsa..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-wamma-card border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-wamma-muted focus:outline-none focus:border-wamma-gold"
            />

            {/* Totales */}
            <div className="space-y-1 bg-wamma-card p-3 rounded-xl border border-wamma-gold/10">
              <div className="flex justify-between text-xs text-wamma-muted">
                <span>Subtotal USD:</span>
                <span className="font-bold text-white">${totalUSD.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-white pt-1 border-t border-white/5">
                <span>Total a Pagar (VES):</span>
                <span className="text-wamma-gold">
                  Bs. {totalVES.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Botón WhatsApp */}
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-950/50 transition-all active:scale-95 text-sm"
            >
              <span>Pedir por WhatsApp</span>
            </button>

            <button
              onClick={clearCart}
              className="w-full text-center text-[11px] text-wamma-muted hover:text-red-400 transition-colors"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
}