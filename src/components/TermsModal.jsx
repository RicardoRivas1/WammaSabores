import React from 'react';

export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-base font-bold text-white">Términos y Condiciones</h2>
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
            <h3 className="text-sm font-bold text-amber-400">1. Exención de Responsabilidad por Infraestructura</h3>
            <p>
              La plataforma opera bajo el principio de "tal cual" (AS IS). Wamma Sabores no se hace responsable por pérdidas
              de ventas, lucro cesante o indisponibilidad temporal causadas por fallas en servidores externos (incluyendo
              pero no limitado a Vercel, bases de datos o proveedores de internet). El uso de esta plataforma implica la
              aceptación de que la disponibilidad del servicio depende de terceros ajeno a nuestro control.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-amber-400">2. Limitación Financiera</h3>
            <p>
              En ningún caso la responsabilidad de Wamma Sabores ante reclamos de cualquier naturaleza superará el valor
              total del pedido realizado por el usuario en la plataforma. El usuario acepta que esta es la máxima
              responsabilidad asumida por el restaurante.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-amber-400">3. Modificaciones de Menú</h3>
            <p>
              Los precios, platillos, disponibilidad de ingredientes y opciones del menú están sujetos a cambios sin
              previo aviso por parte del restaurante. Las imágenes mostradas en la plataforma son referenciales y pueden
              diferir ligeramente del producto final entregado.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-amber-400">4. Pedidos y Confirmación</h3>
            <p>
              Todos los pedidos realizados a través de la plataforma se confirman y coordinan directamente vía WhatsApp.
              El envío de un pedido no constituye una venta confirmada hasta que sea recibida la confirmación explícita
              por parte del restaurante a través de WhatsApp.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-amber-400">5. Aceptación</h3>
            <p>
              Al utilizar esta plataforma, el usuario declara haber leído, comprendido y aceptado la totalidad de los
              presentes Términos y Condiciones. Si no está de acuerdo con alguno de estos términos, le recomendamos
              no utilizar la plataforma.
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
