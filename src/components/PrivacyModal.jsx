import React from 'react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-base font-bold text-white">Política de Privacidad</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 text-xl font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-xs text-zinc-300 leading-relaxed">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-amber-400">1. Datos Recopilados</h3>
            <p>
              A través de esta plataforma se recopilan únicamente los datos necesarios para procesar y entregar tu
              pedido: nombre, número de teléfono, dirección de entrega, punto de referencia y método de pago seleccionado.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-amber-400">2. Uso de los Datos</h3>
            <p>
              Los datos ingresados se utilizan exclusivamente para procesar, coordinar y entregar tu pedido. No se
              utilizan para fines de marketing, publicidad o cualquier otro propósito distinto al mencionado.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-amber-400">3. No Compartición con Terceros</h3>
            <p>
              Tus datos personales no se comparten, venden ni transmiten a terceros. La información se mantiene
              estrictamente dentro de los canales de comunicación directa entre tú y Wamma Sabores.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-amber-400">4. Almacenamiento</h3>
            <p>
              Los datos no se almacenan en servidores externos de forma persistente. La información se transmite en
              tiempo real a través de WhatsApp para la gestión de tu pedido y no se conserva en bases de datos de
              la plataforma más allá de la sesión activa.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-amber-400">5. Eliminación de Datos</h3>
            <p>
              Si deseas que eliminemos cualquier dato asociado a tu persona, puedes solicitarlo contactándonos
              directamente a través de nuestros canales oficiales de WhatsApp. Atenderemos tu solicitud en el
              menor tiempo posible.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
