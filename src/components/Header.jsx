import EmberField from './EmberField'

export default function Header({ query, onQueryChange }) {
  return (
    <header
      className="relative overflow-hidden border-b border-line px-5 pt-6 pb-4"
      style={{
        background:
          'radial-gradient(120% 90% at 15% 0%, rgba(230,81,0,0.20) 0%, rgba(230,81,0,0) 55%), linear-gradient(180deg, #201f1d 0%, #1C1C1E 100%)',
      }}
    >
      <EmberField />

      <div className="relative z-10 flex items-center gap-3">
        <div
          className="flex h-[46px] w-[46px] flex-none items-center justify-center rounded-xl font-display text-[22px] text-bg shadow-[0_6px_18px_rgba(230,81,0,0.35)]"
          style={{ background: 'linear-gradient(145deg, #FF7A29, #D32F2F)' }}
        >
          W
        </div>
        <div>
          <h1 className="font-display text-[26px] uppercase leading-none text-cream">
            WAMMA <span className="text-ember-2">SABORES</span>
          </h1>
          <p className="mt-1 text-[12.5px] font-semibold uppercase tracking-wide text-muted before:content-['📍_']">
            Cocina Urbana &amp; Especialidades · La Candelaria
          </p>
        </div>
      </div>

      <div className="char-divider relative z-10 mt-4 h-2 rounded opacity-60" />

      <div className="relative z-10 mt-4">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base opacity-70">
          🔎
        </span>
        <input
          type="text"
          inputMode="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar por plato o ingrediente (ej. tocineta, pepperoni...)"
          className="w-full rounded-2xl border border-line bg-surface py-3 pl-11 pr-4 text-[15px] text-cream placeholder:text-[#82828a] outline-none transition focus:border-ember-2 focus:ring-4 focus:ring-ember/20"
        />
      </div>
    </header>
  )
}
