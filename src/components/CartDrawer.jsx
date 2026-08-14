import React from 'react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart = [],
  onUpdateQuantity,
  orderNotes,
  setOrderNotes,
  deliveryOption,
  setDeliveryOption,
  address,
  setAddress,
  onSendWhatsApp,
  tasaBcv
}) {
  if (!isOpen) return null;

  // Manejo seguro del botón restar
  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    } else {
      // Si llega a 0, lo elimina limpiamente
      onUpdateQuantity(item.id, 0);
    }
  };

  const subtotalUSD = cart.reduce((sum, item) => {
    const price = Number(String(item.price).replace(/[^0-9.-]+/g, '')) || 0;
    return sum + price * (item.quantity || 1);
  }, 0);

  const totalVES = tasaBcv ? subtotalUSD * tasaBcv : 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-950 h-full flex flex-col justify-between p-5 border-l border-zinc-800 text-white shadow-2xl relative overflow-y-auto">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold flex items-center gap-2">🛒 Tu Pedido</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 text-xl font-bold">✕</button>
        </div>

        {/* Lista de productos */}
        <div className="flex-1 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <p className="text-sm">Tu carrito está vacío</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-3 rounded-lg">
                <div className="flex-1 pr-2">
                  <h4 className="text-sm font-semibold text-white">{item.name}</h4>
                  <p className="text-xs text-amber-400 font-bold">
                    ${(Number(String(item.price).replace(/[^0-9.-]+/g, '')) * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>

                {/* Controles de cantidad corregidos */}
                <div className="flex items-center gap-2 bg-zinc-800 px-2 py-1 rounded-md border border-zinc-700">
                  <button 
                    onClick={() => handleDecrement(item)} 
                    className="text-zinc-300 hover:text-white font-bold text-base px-2 py-0.5 rounded active:scale-95 transition-transform"
                    title="Restar o eliminar"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-white min-w-[20px] text-center select-none">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} 
                    className="text-zinc-300 hover:text-white font-bold text-base px-2 py-0.5 rounded active:scale-95 transition-transform"
                    title="Añadir uno más"
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Opciones de Delivery y Dirección */}
        {cart.length > 0 && (
          <div className="space-y-4 border-t border-zinc-800 pt-4">
            
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">🛵 Opciones de Entrega:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryOption('delivery')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                    deliveryOption === 'delivery'
                      ? 'bg-amber-500 text-black border-amber-500'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  Delivery
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryOption('pickup')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${
                    deliveryOption === 'pickup'
                      ? 'bg-amber-500 text-black border-amber-500'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  Pick-up (Retiro)
                </button>
              </div>
            </div>

            {/* Campo Dirección */}
            {deliveryOption === 'delivery' && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-zinc-300">📍 Dirección de entrega:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Escribe tu zona, edificio, casa..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 pr-8 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                  {address && (
                    <button
                      type="button"
                      onClick={() => setAddress('')}
                      className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-white text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Observaciones */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">📝 Observaciones (Sin ingredientes, etc.):</label>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Ej: Sin cebolla, refresco frío..."
                rows="2"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>
          </div>
        )}

        {/* Totales y Envío */}
        <div className="border-t border-zinc-800 pt-4 mt-4 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-400">Total USD:</span>
            <span className="text-amber-400 font-extrabold text-lg">${subtotalUSD.toFixed(2)}</span>
          </div>

          {totalVES > 0 && (
            <div className="flex justify-between items-center text-xs text-zinc-400">
              <span>Total Estimado (VES):</span>
              <span>Bs. {totalVES.toFixed(2)}</span>
            </div>
          )}

          <button
            disabled={cart.length === 0}
            onClick={onSendWhatsApp}
            className="w-full py-3.5 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 text-white font-bold rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <span>💬</span> Pedir o Consultar por WhatsApp
          </button>
        </div>

      </div>
    </div>
  );
}