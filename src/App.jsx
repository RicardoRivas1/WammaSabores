import React, { useState } from 'react';
import SearchBar from './components/SearchBar'; // Importamos la lupa

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [searchTerm, setSearchTerm] = useState(''); // Estado para la lupa
  const [orderNotes, setOrderNotes] = useState(''); // Notas para quitar ingredientes
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { addToCart, cart, tasaBcv } = useCart();

  const totalItems = cart ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

  // Filtrado combinado: Categoría + Buscador por texto
  const filteredProducts = initialProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === 'todas' ||
      product.cat === selectedCategory ||
      product.category === selectedCategory;

    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Envío a WhatsApp ajustado para incluir las notas de los clientes
  const handleWhatsAppClick = () => {
    const subtotalUSD = cart
      ? cart.reduce((sum, item) => {
          const price =
            Number(String(item.price).replace(/[^0-9.-]+/g, '')) || 0;
          return sum + price * (item.quantity || 1);
        }, 0)
      : 0;

    sendOrderToWhatsApp({
      cart,
      totalUSD: subtotalUSD,
      totalVES: tasaBcv ? subtotalUSD * tasaBcv : 0,
      tasaBcv,
      notes: orderNotes // Pasamos los ingredientes a quitar
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans pb-20">
      <Header />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 space-y-4">
        {/* Barra de Búsqueda con Lupa */}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Navegación por Categorías */}
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Grilla de Productos */}
        <ProductGrid
          products={filteredProducts}
          onAddToCart={(product) => addToCart(product)}
        />
      </main>

      {/* Carrito con el apartado de observaciones */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        orderNotes={orderNotes}
        setOrderNotes={setOrderNotes}
        onSendWhatsApp={handleWhatsAppClick}
      />
    </div>
  );
}