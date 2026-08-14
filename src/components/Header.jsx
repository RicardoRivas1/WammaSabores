import React from 'react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-neutral-900/90 backdrop-blur-md border-b border-orange-500/20 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Marca y Logo */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-300"></div>
            <img 
              src="wamma.jpg.png" 
              alt="Wamma Sabores Logo" 
              className="relative h-14 w-14 rounded-xl object-cover shadow-2xl border border-orange-500/30"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white font-sans uppercase">
              Wamma <span className="text-orange-500 font-extrabold">Sabores</span>
            </h1>
            <p className="text-xs text-orange-400/80 font-medium tracking-widest uppercase">
              Sabor Callejero Premium
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-950/40 border border-orange-500/30 text-xs font-semibold text-orange-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Abierto para Pedidos
        </div>
      </div>
    </header>
  );
}