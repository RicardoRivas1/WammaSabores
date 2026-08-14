export const PHONE_NUMBER = '584242608180'; 

export const GENERIC_MESSAGE = "¡Hola Wamma Sabores! Quisiera consultar el menú o realizar un pedido.";

export function waLink(text = GENERIC_MESSAGE, phone = PHONE_NUMBER) {
  const cleanPhone = phone.replace(/\D/g, '');
  const encoded = encodeURIComponent(text);
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
}

export function sendOrderToWhatsApp({
  cart = [],
  totalUSD = 0,
  totalVES = 0,
  tasaBcv = null,
  address = '',
  distanceKm = null,
  notes = ''
}) {
  // 1. Si no hay ítems en el carrito, enviar mensaje genérico
  if (!cart || cart.length === 0) {
    const url = waLink(GENERIC_MESSAGE);
    window.open(url, '_blank') || (window.location.href = url);
    return;
  }

  // 2. Si HAY pedido, armar el mensaje estructurado
  let message = `🛒 *¡NUEVO PEDIDO EN WAMMA SABORES!* 🍔🔥\n\n`;
  message += `📝 *DETALLE DEL PEDIDO:*\n`;

  cart.forEach((item, index) => {
    const price = Number(String(item.price).replace(/[^0-9.-]+/g, '')) || 0;
    const qty = Number(item.quantity) || 1;
    const itemTotalUSD = (price * qty).toFixed(2);

    message += `• ${qty}x ${item.name} - $${itemTotalUSD}\n`;
  });

  // Totales
  const safeUSD = Number(totalUSD) || 0;
  message += `\n💵 *TOTAL USD:* $${safeUSD.toFixed(2)}\n`;

  if (tasaBcv) {
    const safeBCV = Number(tasaBcv) || 0;
    message += `🇻🇪 *Tasa BCV:* Bs. ${safeBCV.toFixed(2)}\n`;
  }

  if (totalVES) {
    const safeVES = Number(totalVES) || 0;
    const formattedVES = safeVES.toLocaleString('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    message += `🇻🇪 *Total a Pagar (VES):* Bs. ${formattedVES}\n`;
  }

  // Dirección y Distancia
  message += `\n📍 *DIRECCIÓN DE ENTREGA:*\n`;
  if (address && address.trim() !== '') {
    message += `${address}\n`;
    if (distanceKm) {
      message += `📏 *Distancia estimada:* ${distanceKm} km\n`;
    }
  } else {
    message += `(Ubicación no especificada / Por acordar en el chat)\n`;
  }

  // Observaciones
  if (notes && notes.trim() !== '') {
    message += `\n📝 *Observaciones:* ${notes}\n`;
  }

  message += `\n❓ *¿Deseas confirmar el pedido?*`;

  // Abrir WhatsApp con la API oficial
  const url = waLink(message);
  window.open(url, '_blank') || (window.location.href = url);
}