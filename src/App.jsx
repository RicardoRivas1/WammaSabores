import { useMemo, useState } from 'react'
import Header from './components/Header'
import CategoryNav from './components/CategoryNav'
import ProductGrid from './components/ProductGrid'
import WhatsAppFab from './components/WhatsAppFab'
import CartDrawer from './components/CartDrawer' 
import { CATEGORIES, PRODUCTS } from './data/products'
import { useCart } from './context/CartContext' 

export default function App() {
  const [activeCat, setActiveCat] = useState('todos')
  const [query, setQuery] = useState('')

  // Extraer funciones y datos del carrito
  const { addToCart, itemCount, setIsCartOpen } = useCart()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return PRODUCTS.filter((p) => {
      const matchesCat = activeCat === 'todos' ? true : p.cat === activeCat
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
      return matchesCat && matchesQuery
    })
  }, [activeCat, query])

  const activeLabel = CATEGORIES.find((c) => c.id === activeCat)?.label ?? ''
  const sectionTitle = query.trim() ? `Resultados para "${query.trim()}"` : activeLabel

  return (
    <div className="min-h-screen bg-bg font-body text-cream relative">
      <Header query={query} onQueryChange={setQuery} />
      <CategoryNav active={activeCat} onChange={setActiveCat} />

      <main className="px-4 pb-[130px] pt-4.5 sm:mx-auto sm:max-w-[640px]">
        <div className="mb-3.5 mt-1.5 flex items-baseline justify-between px-0.5">
          <h2 className="m-0 text-[13px] font-extrabold uppercase tracking-wide text-muted">
            {sectionTitle}
          </h2>
          <span className="text-[12px] font-semibold text-[#6f6f76]">
            {filtered.length} {filtered.length === 1 ? 'plato' : 'platos'}
          </span>
        </div>

        {/* 3. Pasamos la función addToCart a ProductGrid */}
        <ProductGrid products={filtered} onAddToCart={addToCart} />
      </main>

      {/* 4. Modal / Drawer del Carrito */}
      <CartDrawer />

      {/* 5. Botón Flotante con contador de ítems */}
      {itemCount > 0 ? (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-5 z-40 bg-wamma-gold text-black p-3.5 rounded-full shadow-2xl font-black flex items-center gap-2 active:scale-95 transition-transform border border-black/20"
        >
          <span className="text-xl">🛒</span>
          <span className="bg-black text-wamma-gold text-xs px-2 py-0.5 rounded-full font-black">
            {itemCount}
          </span>
        </button>
      ) : (
        <WhatsAppFab />
      )}

      <footer className="px-5 pb-5 pt-2 text-center text-[11.5px] text-[#5c5c62]">
        Wamma Sabores © 2026 · La Candelaria, Caracas
      </footer>
    </div>
  )
}