import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

// Coordenadas fijas de Wamma Sabores
const WAMMA_LOCATION = { lat: 10.4983, lng: -66.8983 };
const PHONE_NUMBER = '584142608180'; //REEMPLAZAR CON NUMERO REAL BTW

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [distanceKm, setDistanceKm] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fórmula Haversine para calcular distancia
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Debounce para la búsqueda de direcciones (evita el error 429)
  useEffect(() => {
    if (address.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address + ', Caracas, Venezuela'
          )}&limit=5`,
          {
            headers: {
              'Accept-Language': 'es',
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
        }
      } catch (error) {
        console.error('Error al buscar dirección:', error);
      } finally {
        setIsLoading(false);
      }
    }, 500); // Espera 500ms después de que el usuario deja de escribir

    return () => clearTimeout(timer);
  }, [address]);

  const handleSelectSuggestion = (item) => {
    setAddress(item.display_name);
    setSuggestions([]);

    const userLat = parseFloat(item.lat);
    const userLng = parseFloat(item.lon);

    if (!isNaN(userLat) && !isNaN(userLng)) {
      const km = calculateDistance(
        WAMMA_LOCATION.lat,
        WAMMA_LOCATION.lng,
        userLat,
        userLng
      );
      setDistanceKm(km.toFixed(1));
    }
  };

  // Totales
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Armado del mensaje estructurado para WhatsApp
  const handleSendWhatsApp = () => {
    if (cart.length === 0) return;

    let message = `*¡Hola Wamma Sabores! Quiero realizar un pedido:* 🍔🔥\n\n`;
    message += `*--- DETALLE DEL PEDIDO ---*\n`;

    cart.forEach((item) => {
      message += `• ${item.quantity}x ${item.name} - $${(
        item.price * item.quantity
      ).toFixed(2)}\n`;
    });

    message += `\n*Total a Pagar:* $${subtotal.toFixed(2)}\n`;

    if (address) {
      message += `\n*--- DIRECCIÓN DE ENTREGA ---*\n📍 ${address}`;
      if (distanceKm) {
        message += `\n📏 Distancia aprox: ${distanceKm} km`;
      }
    } else {
      message += `\n📍 *Ubicación:* Por acordar en el chat`;
    }

    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-neutral-900 h-full p-6 flex flex-col justify-between overflow-y-auto">
        {/* Cabecera */}
        <div>
          <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-3">
            <h2 className="text-xl font-black text-white">Tu Pedido</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl font-bold"
            >
              ✕
            </button>
          </div>

          {/* Buscador de dirección */}
          <div className="mb-6 relative">
            <label className="block text-xs font-bold text-wamma-gold uppercase mb-2">
              Dirección de Entrega (Caracas)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ej: Parque Central, Av. Lecuna..."
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-sm focus:border-wamma-gold outline-none"
            />

            {isLoading && (
              <span className="text-[10px] text-gray-400 mt-1 block">
                Buscando ubicación...
              </span>
            )}

            {/* Sugerencias */}
            {suggestions.length > 0 && (
              <ul className="absolute z-20 w-full bg-neutral-800 border border-neutral-700 rounded-xl mt-1 max-h-48 overflow-y-auto shadow-2xl">
                {suggestions.map((item, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleSelectSuggestion(item)}
                    className="p-3 text-xs text-gray-200 hover:bg-neutral-700 cursor-pointer border-b border-neutral-700/50 last:border-0"
                  >
                    {item.display_name}
                  </li>
                ))}
              </ul>
            )}

            {distanceKm !== null && (
              <div className="mt-2 p-2 bg-wamma-gold/10 border border-wamma-gold/30 rounded-lg text-xs text-wamma-gold font-bold">
                📍 Distancia estimada: {distanceKm} km
              </div>
            )}
          </div>

          {/* LISTA DE PRODUCTOS AGREGADOS */}
          <div className="space-y-3 mb-6">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Productos Seleccionados
            </h3>

            {cart.length === 0 ? (
              <p className="text-sm text-gray-500 py-4 text-center">
                El carrito está vacío.
              </p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-neutral-800/60 rounded-xl border border-neutral-800"
                >
                  <div className="flex-1 pr-2">
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-xs text-wamma-gold font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Botones + / - / Eliminar */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className="w-7 h-7 rounded-lg bg-neutral-700 text-white font-bold flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-white w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-neutral-700 text-white font-bold flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-400 ml-1 text-sm p-1"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PIE DEL CARRITO (TOTAL Y BOTÓN WHATSAPP) */}
        <div className="border-t border-neutral-800 pt-4 mt-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-400">Total a Pagar:</span>
            <span className="text-xl font-black text-wamma-gold">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleSendWhatsApp}
            disabled={cart.length === 0}
            className={`w-full py-3.5 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
              cart.length > 0
                ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white cursor-pointer'
                : 'bg-neutral-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>📱 Pedir por WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}