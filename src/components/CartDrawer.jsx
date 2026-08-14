import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

// Coordenadas fijas de Wamma Sabores
const WAMMA_LOCATION = { lat: 10.4983, lng: -66.8983 }; 

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [distanceKm, setDistanceKm] = useState(null);

  // Fórmula Haversine para calcular distancia en km
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
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

  // Buscar dirección con Nominatim
  const handleAddressSearch = async (query) => {
    setAddress(query);
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query + ', Caracas, Venezuela'
        )}&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error al buscar dirección:', error);
    }
  };

  // Seleccionar sugerencia y calcular km
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-neutral-900 h-full p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-white">Tu Pedido</h2>
            <button onClick={onClose} className="text-gray-400 text-2xl font-bold">
              ✕
            </button>
          </div>

          {/* Buscador de dirección y Delivery */}
          <div className="mb-6 relative">
            <label className="block text-xs font-bold text-wamma-gold uppercase mb-2">
              Dirección de Entrega (Caracas)
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => handleAddressSearch(e.target.value)}
              placeholder="Ej: Parque Central, Av. Lecuna..."
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white text-sm focus:border-wamma-gold outline-none"
            />

            {/* Menú desplegable de sugerencias */}
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-neutral-800 border border-neutral-700 rounded-xl mt-1 max-h-48 overflow-y-auto shadow-2xl">
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

            {/* Cálculo de Distancia */}
            {distanceKm !== null && (
              <div className="mt-2 p-2 bg-wamma-gold/10 border border-wamma-gold/30 rounded-lg text-xs text-wamma-gold font-bold">
                📍 Distancia estimada: {distanceKm} km
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}