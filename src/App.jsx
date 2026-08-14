import React, { useState } from 'react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import WhatsAppFab from './components/WhatsAppFab';
import { PRODUCTS as initialProducts } from './data/products.js';
import { useCart } from './context/CartContext';
import { sendOrderToWhatsApp } from './utils/whatsapp';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { addToCart, cart, tasaBcv } = useCart();

  const totalItems = cart ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

  const filteredProducts =
    selectedCategory === 'todos'
      ? initialProducts
      : initialProducts.filter(
          (product) =>
            product.cat === selectedCategory ||
            product.category === selectedCategory
        );

  // Lógica para enviar el pedido al hacer clic en el botón flotante de abajo
  const handleWhatsAppClick = () => {
    const subtotalUSD = cart ? cart.reduce((sum, item) => {
      const price = Number(String(item.price).replace(/[^0-9.-]+/g, '')) || 0;
      return sum + (price * (item.quantity || 1));
    }, 0) : 0;

    sendOrderToWhatsApp({
      cart,
      totalUSD: subtotalUSD,
      totalVES: tasaBcv ? subtotalUSD * tasaBcv : 0,
      tasaBcv,
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans pb-20">
      <Header />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 space-y-6">
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <ProductGrid
          products={filteredProducts}
          onAddToCart={(product) => addToCart(product)}
        />
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Botón flotante "Ver Pedido" */}
      {totalItems > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-20 right-4 z-40 bg-wamma-gold text-black font-black px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm hover:scale-105 transition-transform"
        >
          <span>🛒 Ver Pedido</span>
          <span className="bg-black text-wamma-gold text-xs px-2 py-0.5 rounded-full font-bold">
            {totalItems}
          </span>
        </button>
      )}

      {/* Botón Naranja Inferior conectado al Carrito */}
      <WhatsAppFab onClick={handleWhatsAppClick} />
    </div>
  );
}