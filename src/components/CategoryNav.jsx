import { CATEGORIES } from '../data/products'

export default function CategoryNav({ active, onChange }) {
  return (
    <nav className="sticky top-0 z-30 border-b border-line bg-bg/90 py-3 backdrop-blur-md">
      <div className="no-scrollbar flex gap-2.5 overflow-x-auto px-4 sm:mx-auto sm:max-w-[640px]">
        {CATEGORIES.map((c) => {
          const isActive = c.id === active
          return (
            <button
              key={c.id}
              onClick={() => onChange(c.id)}
              className={[
                'flex flex-none scroll-mx-4 items-center gap-1.5 whitespace-nowrap rounded-full border px-4 py-2.5 text-[13.5px] font-bold transition-all active:scale-95',
                isActive
                  ? 'border-transparent text-white shadow-[0_4px_16px_rgba(230,81,0,0.4)] -translate-y-px'
                  : 'border-line bg-surface text-muted',
              ].join(' ')}
              style={
                isActive
                  ? { background: 'linear-gradient(135deg, #FF7A29, #D32F2F)' }
                  : undefined
              }
            >
              <span>{c.icon}</span>
              <span>{c.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
