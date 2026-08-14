import React from 'react';

export default function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div className="relative w-full mb-4">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {/* Ícono de Lupa */}
        <svg
          className="w-5 h-5 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Buscar platillo, ingrediente o bebida..."
        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 text-sm transition-all"
      />
      {searchTerm && (
        <button
          onClick={() => setSearchTerm('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white text-xs font-bold"
        >
          ✕
        </button>
      )}
    </div>
  );
}