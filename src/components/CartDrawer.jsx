
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { calculateDeliveryFee } from '../utils/deliveryUtils';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  
  // Estados para el método de entrega y distancia
  const [isDelivery, setIsDelivery] = useState(true);
  const [distance, setDistance] = useState(2.5); // Distancia por defecto en km
  const [address, setAddress] = useState('');

  // Cálculo de subtotales y delivery
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = isDelivery ? calculateDeliveryFee(distance) : 0;
  const total = subtotal + deliveryFee;

  if (!isOpen) return null;

  // Función para enviar pedido a WhatsApp
  const handleSendOrder = () => {
    if (cart.length === 0) return;

    let message = `*¡Nuevo Pedido - Wamma Sabores!* 🍔🔥\n\n`;
    message += `*Detalle del pedido:*\n`;
    
    cart.forEach((item) => {
      message += `• ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n*Subtotal:* $${subtotal.toFixed(2)}`;
    
    if (isDelivery) {
      message += `\n*Método:* 🛵 Delivery (${distance} km)`;
      message += `\n*Costo Delivery:* $${deliveryFee.toFixed(2)}`;
      if (address) message += `\n*Dirección:* ${address}`;
    } else {
      message += `\n*Método:* 🛍️ Retiro en Local`;
    }

    message += `\n\n*TOTAL A PAGAR:* $${total.toFixed(2)}`;

    const phoneNumber = '584120000000'; // Sustituye con numero de local btw
    const encodedMessage = encodeURIComponent(message);
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-neutral-900 border-l border-orange-500/20 text-white h-full flex flex-col shadow-2xl">
        
        {/* Cabecera del Carrito */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/90">
          <h2 className="text-lg font-bold text-orange-500 flex items-center gap-2">
            🛒 Tu Pedido
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <p className="text-center text-neutral-500 my-8">Tu carrito está vacío.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-neutral-800/50 p-3 rounded-xl border border-neutral-800"
              >
                <div>
                  <h4 className="font-semibold text-sm">{item.name}</h4>
                  <p className="text-xs text-orange-400">${item.price.toFixed(2)} c/u</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 rounded bg-neutral-700 text-white text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 rounded bg-neutral-700 text-white text-xs font-bold"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 text-xs ml-2"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Opciones de Entrega y Totales */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-neutral-800 bg-neutral-950 space-y-4">
            
            {/* Botones de Entrega */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsDelivery(true)}
                className={`py-2 px-3 rounded-xl font-bold text-xs border transition ${
                  isDelivery
                    ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-600/30'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                }`}
              >
                🛵 Delivery
              </button>
              <button
                type="button"
                onClick={() => setIsDelivery(false)}
                className={`py-2 px-3 rounded-xl font-bold text-xs border transition ${
                  !isDelivery
                    ? 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-600/30'
                    : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                }`}
              >
                🛍️ Retiro
              </button>
            </div>

            {/* Configuración de Distancia en KM */}
            {isDelivery && (
              <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-neutral-300">Distancia aproximada:</span>
                  <span className="text-orange-400 font-bold">{distance} km</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.1"
                  value={distance}
                  onChange={(e) => setDistance(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500">
                  <span>hasta 1 km ($1)</span>
                  <span>hasta 8.9 km ($3)</span>
                  <span>18+ km ($7)</span>
                </div>

                <input
                  type="text"
                  placeholder="Dirección exacta de entrega..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-xs bg-neutral-800 border border-neutral-700 rounded-lg p-2 text-white mt-2 focus:outline-none focus:border-orange-500"
                />
              </div>
            )}

            {/* Totales */}
            <div className="space-y-1 text-xs border-t border-neutral-800 pt-3">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Delivery:</span>
                <span className="text-orange-400 font-semibold">
                  {isDelivery ? `$${deliveryFee.toFixed(2)}` : 'Gratis'}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-neutral-800 mt-1">
                <span>Total:</span>
                <span className="text-orange-500">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Botón WhatsApp */}
            <button
              onClick={handleSendOrder}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-2"
            >
              💬 Pedir por WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
}