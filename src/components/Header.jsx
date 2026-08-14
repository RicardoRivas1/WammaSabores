import React from 'react';

export default function Header() {
  return (
    <header className="sticky top-0 z-30 bg-neutral-900/90 backdrop-blur-md border-b border-wamma-gold/20 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Logo del local */}
        <img 
          src="wamma.png" 
          alt="Wamma Sabores Logo" 
          className="w-14 h-14 rounded-full border border-wamma-gold/40 object-cover"
        /> 
        <div>
          <h1 className="font-black text-base leading-none text-white tracking-wide">
            WAMMA SABORES
          </h1>
          <span className="text-[10px] text-wamma-gold uppercase tracking-widest font-semibold">
            Sabor Callejero Premium
          </span>
        </div>
      </div>
    </header>
  );
}