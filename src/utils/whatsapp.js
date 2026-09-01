// Número oficial de Wamma Sabores
export const PHONE_NUMBER = '584123376629'; 

export const GENERIC_MESSAGE = "¡Hola Wamma Sabores! Quisiera consultar el menú o realizar un pedido.";

// Generador de URL oficial
export function waLink(text = GENERIC_MESSAGE, phone = PHONE_NUMBER) {
  const cleanPhone = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(text);
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
}

// Función principal de envío de pedido por WhatsApp
export function sendOrderToWhatsApp({
  cart = [],
  totalUSD = 0,
  deliveryFeeUSD = 0,
  tasaBcv = null,
  address = '',
  distanceKm = null,
  notes = '',
  customerData = {}, // 👈🏻 Requerimiento 1: Recibe los datos del cliente
  location = null,   // 👈🏻 Ubicación GPS seleccionada en el mapa
}) {
  if (!cart || cart.length === 0) {
    const url = waLink(GENERIC_MESSAGE);
    window.open(url, '_blank') || (window.location.href = url);
    return;
  }

  const subtotalUSD = Number(totalUSD) || 0;
  const deliveryUSD = Number(deliveryFeeUSD) || 0;
  const finalTotalUSD = subtotalUSD + deliveryUSD;

  let message = `🛒 *¡NUEVO PEDIDO EN WAMMA SABORES!* 🍔🔥\n\n`;
  message += `📝 *DETALLE DEL PEDIDO:*\n`;

  // Requerimiento 2 y 3: Renderizado de productos y sus contornos elegidos
  cart.forEach((item) => {
    if (!item) return;
    const price = Number(String(item.price).replace(/[^0-9.-]+/g, '')) || 0;
    const qty = Number(item.quantity || item.qty) || 1;
    const itemTotalUSD = (price * qty).toFixed(2);

    message += `• ${qty}x ${item.name} - $${itemTotalUSD}\n`;

    // Si el producto tiene contornos seleccionados, los agrega al mensaje
    if (item.selectedContornos && Array.isArray(item.selectedContornos) && item.selectedContornos.length > 0) {
      const resolved = item.selectedContornos.map((c, i) => {
        if (c === 'OTROS') {
          const custom = item.customContornosText?.[i] || '';
          return custom ? `OTROS: ${custom}` : 'OTROS (sin especificar)';
        }
        return c || 'Sin seleccionar';
      });
      message += `   🥗 *Contornos:* ${resolved[0]} / ${resolved[1]}\n`;
    }
  });

  // Desglose Financiero
  message += `\n💵 *Subtotal:* $${subtotalUSD.toFixed(2)}`;
  
  if (deliveryUSD > 0) {
  message += `\n🛵 *Delivery`;
  if (distanceKm != null) message += ` · ${distanceKm} km`;
  message += `:* $${deliveryUSD.toFixed(2)}`;
} else {
  message += `\n🛵 *Delivery:* Por acordar / Ubicación no ingresada`;
}

  message += `\n🔥 *TOTAL A PAGAR (USD):* $${finalTotalUSD.toFixed(2)}\n`;

  if (tasaBcv) {
    const safeBCV = Number(tasaBcv) || 0;
    const totalVES = finalTotalUSD * safeBCV;
    const formattedVES = totalVES.toLocaleString('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    message += `🇻🇪 *Tasa BCV:* Bs. ${safeBCV.toFixed(2)}\n`;
    message += `🇻🇪 *TOTAL A PAGAR (VES):* Bs. ${formattedVES}\n`;
  }

  // Observaciones generales
  if (notes && notes.trim() !== '') {
    message += `\n📝 *Observaciones:* ${notes}\n`;
  }

  // Requerimiento 1 y 3: Formato exacto de datos del cliente
  message += `\n👉🏻 *Complete los siguientes datos* 👇🏻\n\n`;
  message += `*Nombre y Apellido:* ${customerData.nombre || ''}\n`;
  message += `*Dirección escrita y GPS:* ${customerData.direccion || address || ''}\n`;
  message += `*Punto de referencia:* ${customerData.referencia || ''}\n`;
  message += `*Teléfono 1:* ${customerData.telefono1 || ''}\n`;
  message += `*Teléfono 2:* ${customerData.telefono2 || 'N/A'}\n`;
  message += `*Forma de pago:* ${customerData.pago || ''}\n`;

  if (distanceKm) {
    message += `📏 *Distancia estimada:* ${distanceKm} km\n`;
  }

  // Ubicación exacta con enlace a Google Maps
  if (location && location.latitude != null && location.longitude != null) {
    message += `📍 *Ubicación exacta (GPS):* https://www.google.com/maps?q=${location.latitude},${location.longitude}\n`;
  }

  message += `\n❓ *¿Deseas confirmar el pedido?*`;

  const url = waLink(message);
  window.open(url, '_blank') || (window.location.href = url);
}