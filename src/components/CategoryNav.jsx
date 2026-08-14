import React from 'react';
import { CATEGORIES } from '../data/products';

export default function CategoryNav({ selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-3 px-4 flex gap-2 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-10">
      {CATEGORIES.map((cat) => {
        const isActive = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
              isActive
                ? 'bg-orange-600 text-white shadow-lg scale-105'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}