import { ZONAS_DELIVERY } from '../data/deliveryZones';

// Coordenadas fijas del local (Lat, Lon)
export const RESTAURANT_COORDS = {
  lat: 10.498625, // Cambiar por la latitud exacta del local btw
  lon: -66.898875, // Cambiar por la longitud exacta del local btw
};

// Redondea un número a 2 decimales
function round2(value) {
  return Number(Number(value).toFixed(2));
}

// Detecta si el texto de una dirección coincide con alguna zona fija de delivery
export function detectZone(addressText) {
  if (!addressText) return null;
  const text = String(addressText).toLowerCase();

  return (
    ZONAS_DELIVERY.find((zona) =>
      zona.keywords.some((kw) => text.includes(String(kw).toLowerCase())),
    ) || null
  );
}

// Escala de tarifas por kilómetro (la distancia ya va redondeada a 2 decimales)
export function calculateDeliveryFeeByKm(distanceKm) {
  const km = round2(distanceKm);
  if (Number.isNaN(km) || km <= 0) return 0;

  if (km <= 1.0) return 1.0;
  if (km <= 2.9) return 2.0;
  if (km <= 8.9) return 3.0;
  if (km <= 14.9) return 4.0;
  if (km <= 16.91) return 5.0;
  if (km <= 18.0) return 6.0;
  return 7.0; // Más de 18.00 km
}

// Calcula la tarifa final: zona fija si coincide, si no la escala por KM
export function getDeliveryPricing({ distanceKm = null, addressText = '' } = {}) {
  const roundedKm =
    distanceKm != null && !Number.isNaN(Number(distanceKm))
      ? round2(distanceKm)
      : null;
  const zone = detectZone(addressText);

  if (zone) {
    return { price: zone.precio, zone, distanceKm: roundedKm };
  }

  return {
    price: roundedKm != null ? calculateDeliveryFeeByKm(roundedKm) : 0,
    zone: null,
    distanceKm: roundedKm,
  };
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

// Reverse geocoding: convierte coordenadas a un texto de dirección legible
export async function reverseGeocodeCoords(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
    lat
  )}&lon=${encodeURIComponent(lon)}&zoom=18`;

  try {
    const res = await fetch(url, {
      headers: {
        'Accept-Language': 'es',
      },
    });
    if (!res.ok) return '';
    const data = await res.json();
    return data.display_name || '';
  } catch (error) {
    console.error('Error en reverse geocoding:', error);
    return '';
  }
}

// Calcula KM desde el local hasta la ubicación seleccionada (redondeado a 2 decimales)
export function calculateKmFromCoords(targetLat, targetLon) {
  const distanceKm = getKilometers(
    RESTAURANT_COORDS.lat,
    RESTAURANT_COORDS.lon,
    parseFloat(targetLat),
    parseFloat(targetLon)
  );
  return round2(distanceKm);
}