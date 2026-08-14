/**
 * Calculador de tarifa de delivery por kilometraje
 * @param {number} distanceInKm - Distancia en kilómetros
 * @returns {number} Costo del delivery en USD
 */
export const calculateDeliveryFee = (distanceInKm) => {
  const km = parseFloat(distanceInKm);

  if (isNaN(km) || km < 0) return 0;

  if (km <= 1.00) return 1;
  if (km <= 2.90) return 2;
  if (km <= 8.90) return 3;
  if (km <= 14.90) return 4;
  if (km <= 16.91) return 5;
  if (km <= 18.00) return 6;
  
  // 18.01km en adelante (No definido / Distancia mayor)
  return 7;
};