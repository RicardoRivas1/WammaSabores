import React, { useState } from 'react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import WhatsAppFab from './components/WhatsAppFab';
import { PRODUCTS as initialProducts } from './data/products.js';
import { useCart } from './context/CartContext';

export default function App() {}
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { addToCart, cart } = useCart();

  const filteredProducts = selectedCategory === 'todos' 
    ? initialProducts 
    : initialProducts.filter((product) => product.cat === selectedCategory || product.category === selectedCategory);
      
    export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // 1. Extraer cart del context
  const { addToCart, cart } = useCart();

  // 2. Definir la variable totalItems (AQUÍ ESTÁ LA SOLUCIÓN)
  const totalItems = cart ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;
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
      {/* Botón flotante para ver el carrito */}
      {totalItems > 0 && (
  <button
    onClick={() => setIsCartOpen(true)}
    className="fixed bottom-6 right-4 z-40 bg-wamma-gold text-black font-black px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm hover:scale-105 transition-transform"
  >
    <span>🛒 Ver Pedido</span>
    <span className="bg-black text-wamma-gold text-xs px-2 py-0.5 rounded-full font-bold">
      {totalItems}
    </span>
  </button>
)}
      <WhatsAppFab />
    </div>
  );
    }