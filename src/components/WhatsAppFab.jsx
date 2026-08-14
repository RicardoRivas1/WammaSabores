import React from 'react';

export default function WhatsAppFab({ onClick }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent z-30">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onClick}
          className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-98 transition-all cursor-pointer text-sm"
        >
          <span>💬 Pedir o Consultar por WhatsApp</span>
        </button>
      </div>
    </div>
  );
}