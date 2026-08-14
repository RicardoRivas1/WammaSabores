
export async function getTasaBCV() {
  try {
    // API para consultar la tasa BCV
    const res = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
    if (!res.ok) throw new Error('Error al conectar con la API');
    
    const data = await res.json();
    
    // Devuelve el valor promedio u oficial de la API
    if (data && data.promedio) {
      return parseFloat(data.promedio);
    }
    
    return 36.50; // Fallback por si la respuesta viene vacía
  } catch (error) {
    console.warn('No se pudo obtener la tasa BCV en vivo, usando tasa por defecto:', error);
    return 36.50; // Fallback de seguridad
  }
}