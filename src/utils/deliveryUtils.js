// Coordenadas fijas del local (Lat, Lon)
const RESTAURANT_COORDS = {
  lat: 10.498625, // Cambiar por la latitud exacta del local btw
  lon: -66.898875, // Cambiar por la longitud exacta del local btw
};

// Tarifas del Delivery
const TARIFA_BASE = 2.0;    // Precio base (hasta 2 km)
const PRECIO_POR_KM = 0.50; // Costo por km adicional
const KM_BASE = 2;          // Km incluidos en tarifa base

// Calcula la tarifa en $
export function calculateDeliveryFee(distanceInKm) {
  if (!distanceInKm || distanceInKm <= 0) return 0;
  if (distanceInKm <= KM_BASE) return TARIFA_BASE;

  const kmExtra = distanceInKm - KM_BASE;
  const total = TARIFA_BASE + kmExtra * PRECIO_POR_KM;
  return Number(total.toFixed(2));
}

// Calcula la distancia lineal en KM entre dos coordenadas (Fórmula Haversine)
function getKilometers(lat1, lon1, lat2, lon2) {
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
}

// Busca direcciones directamente en OpenStreetMap
export async function searchAddressFree(query) {
  if (!query || query.length < 3) return [];

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    query
  )}&countrycodes=ve&limit=5`;

  try {
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'es',
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error buscando dirección:', error);
    return [];
  }
}

// Calcula KM desde el local hasta la ubicación seleccionada
export function calculateKmFromCoords(targetLat, targetLon) {
  const distanceKm = getKilometers(
    RESTAURANT_COORDS.lat,
    RESTAURANT_COORDS.lon,
    parseFloat(targetLat),
    parseFloat(targetLon)
  );
  return Number(distanceKm.toFixed(1));
}