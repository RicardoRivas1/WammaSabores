import ProductCard from './ProductCard'

export default function ProductGrid({ products, onAddToCart }) {
  if (products.length === 0) {
    return (
      <div className="px-5 py-16 text-center text-muted">
        <span className="mb-3 block text-[40px]">😕</span>
        <h3 className="mb-1.5 text-[16px] text-cream">No encontramos ese sabor</h3>
        <p className="text-[13.5px]">
          Prueba con otro ingrediente o revisa otra categoría del menú.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {products.map((p, i) => (
        <ProductCard 
          key={p.id} 
          product={p} 
          index={i} 
          onAddToCart={onAddToCart} 
        />
      ))}
    </div>
  )
}