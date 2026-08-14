
export const PHONE_NUMBER = '584242608180'; // Reemplazar por el numero btw

export const GENERIC_MESSAGE = "¡Hola Wamma Sabores! 👋 Quisiera consultar el menú o realizar un pedido.";

export function waLink(text = GENERIC_MESSAGE, phone = PHONE_NUMBER) {
  const encoded = encodeURIComponent(text);
  return `https://wa.me/${phone}?text=${encoded}`;
}
export function sendOrderToWhatsApp({ cart, totalUSD, totalVES, tasaBcv, notes = '' }) {
  let message = `🔥 *NUEVO PEDIDO - WAMMA SABORES* 🔥\n`;
  message += `_________________________________________\n\n`;

  cart.forEach((item, index) => {
    const itemTotalUSD = (item.price * item.quantity).toFixed(2);
    message += `${index + 1}. *${item.name}* (x${item.quantity}) - $${itemTotalUSD}\n`;
  });

  message += `_________________________________________\n\n`;
  message += `💵 *Total USD:* $${totalUSD.toFixed(2)}\n`;
  message += `🇻🇪 *Tasa BCV del día:* Bs. ${tasaBcv.toFixed(2)}\n`;
  message += `💳 *Total a Pagar (VES):* Bs. ${totalVES.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n`;

  if (notes) {
    message += `📝 *Observaciones:* ${notes}\n\n`;
  }

  message += `📍 *Dirección de envío / Retiro:* (Indicar aquí)`;

  window.open(waLink(message), '_blank');
}