import React, { useState } from 'react';
import TermsModal from './TermsModal';
import PrivacyModal from './PrivacyModal';

export default function Footer() {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <footer className="bg-zinc-950 border-t border-zinc-800 py-8 px-4 mt-10">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Aviso de Alérgenos */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs leading-relaxed flex items-start gap-3">
            <span className="text-amber-400 text-base mt-0.5 flex-shrink-0">⚠️</span>
            <p className="text-amber-200/90">
              <strong className="text-amber-400">Aviso sobre Alérgenos:</strong>{' '}
              Nuestros platillos se preparan en instalaciones donde se manipulan ingredientes que pueden contener
              gluten, lácteos, frutos secos y otros alérgenos. Si padece alguna alergia o condición médica severa,
              por favor infórmelo directamente al personal antes de realizar su pedido.
            </p>
          </div>

          {/* Info: Envíos y Pagos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-[11px] space-y-1">
              <p>
                <strong className="text-zinc-200">Envíos y Pedidos:</strong>{' '}
                <span className="text-zinc-400">
                  Los productos añadidos al carrito se confirman y coordinan directamente vía WhatsApp.
                </span>
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-[11px] space-y-1">
              <p>
                <strong className="text-zinc-200">Métodos de Pago:</strong>{' '}
                <span className="text-zinc-400">
                  Pago Móvil, Efectivo (Bs), Transferencia (Bs), Zelle, Efectivo ($), Binance, Mercantil Panamá y Facebank.
                </span>
              </p>
            </div>
          </div>

          {/* Links legales */}
          <div className="flex items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => setShowTerms(true)}
              className="text-zinc-500 hover:text-amber-400 transition-colors underline underline-offset-2"
            >
              Términos y Condiciones
            </button>
            <span className="text-zinc-700">|</span>
            <button
              onClick={() => setShowPrivacy(true)}
              className="text-zinc-500 hover:text-amber-400 transition-colors underline underline-offset-2"
            >
              Política de Privacidad
            </button>
          </div>

          {/* Copyright */}
          <p className="text-center text-[10px] text-zinc-600">
            © 2026 Wamma Sabores. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Modales Legales */}
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </>
  );
}