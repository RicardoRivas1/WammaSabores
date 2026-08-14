import React, { useState } from 'react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import WhatsAppFab from './components/WhatsAppFab';
import { PRODUCTS as initialProducts } from './data/products.js';
import { useCart } from './context/CartContext';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { addToCart, cart } = useCart();

  const filteredProducts = selectedCategory === 'todos' 
    ? initialProducts 
    : initialProducts.filter((product) => product.cat === selectedCategory || product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans pb-20">
      
      {/* Botón para abrir el carrito desde el Header */}
      <Header onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 space-y-6">
        
        {/* Asegúrate de pasar estas 2 props exactamente con estos nombres */}
        <CategoryNav 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
        <ProductGrid
         products={filteredProducts}
        onAddToCart={(product) => {
           addToCart(product);
         }}
/>
      </main>

      {/* CartDrawer debe recibir isOpen e onClose */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
      {/* Botón flotante del carrito en la esquina o barra inferior */}
{cart.length > 0 && (
  <button
    onClick={() => setIsCartOpen(true)}
    className="fixed bottom-20 right-4 z-40 bg-wamma-gold text-black font-black px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm hover:scale-105 transition-transform"
  >
    <span>🛒 Ver Pedido</span>
    <span className="bg-black text-wamma-gold text-xs px-2 py-0.5 rounded-full">
      {cart.reduce((acc, item) => acc + item.quantity, 0)}
    </span>
  </button>
)}
      <WhatsAppFab />
    </div>
  );
}