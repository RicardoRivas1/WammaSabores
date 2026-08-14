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
  
  const { addToCart } = useCart();

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
            setIsCartOpen(true);
          }} 
        />
      </main>

      {/* CartDrawer debe recibir isOpen e onClose */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      <WhatsAppFab />
    </div>
  );
}