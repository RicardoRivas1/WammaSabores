import React from 'react';

export default function Footer() {
  return (
    <footer className="py-6 text-center text-xs text-gray-500 border-t mt-10 bg-white">
      <p className="font-medium text-gray-700">© 2026 Wamma Sabores. Todos los derechos reservados.</p>
      
      {/* Texto legal y políticas claras */}
      <div className="mt-3 max-w-md mx-auto px-4 text-left bg-gray-50 p-3 rounded-lg border border-gray-100 text-[11px] text-gray-500 space-y-1">
        <p>
          <strong className="text-gray-700">Envíos y Pedidos:</strong> Los productos añadidos al carrito se confirman y coordinan directamente vía WhatsApp.
        </p>
        <p>
          <strong className="text-gray-700">Métodos de Pago:</strong> Aceptamos Pago Móvil, Efectivo (Bs), Transferencia (Bs), Zelle, Efectivo ($), Binance, Mercantil Panamá y Facebank.
        </p>
      </div>
    </footer>
  );
}