import React, { useState, useEffect } from 'react';
import { searchAddressFree, calculateKmFromCoords } from '../utils/deliveryUtils';

export default function AddressSearch({ onAddressSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 3) {
        setIsLoading(true);
        const data = await searchAddressFree(query);
        setResults(data);
        setIsLoading(false);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (place) => {
    const addressName = place.display_name;
    const distanceKm = calculateKmFromCoords(place.lat, place.lon);

    setQuery(addressName);
    setResults([]);

    if (onAddressSelect) {
      onAddressSelect({ address: addressName, distance: distanceKm });
    }
  };

  return (
    <div className="relative w-full my-2">
      <label className="block text-xs font-semibold text-neutral-400 mb-1">
        Dirección de entrega:
      </label>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Escribe tu zona (ej. Chacao, Altamira...)"
        className="w-full p-2.5 bg-neutral-900 text-white rounded-lg border border-neutral-700 text-sm focus:outline-none focus:border-amber-500"
      />

      {isLoading && (
        <p className="text-[11px] text-amber-500 mt-1">Buscando zonas...</p>
      )}

      {results.length > 0 && (
        <ul className="absolute z-50 w-full bg-neutral-900 border border-neutral-700 rounded-lg max-h-48 overflow-y-auto mt-1 shadow-2xl">
          {results.map((item) => (
            <li
              key={item.place_id}
              onClick={() => handleSelect(item)}
              className="p-2.5 hover:bg-neutral-800 cursor-pointer text-xs text-neutral-200 border-b border-neutral-800 last:border-none"
            >
              📍 {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}