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
  
  // Obtenemos la función para agregar al carrito desde el Context
  const { addToCart } = useCart(); 

  const filteredProducts = selectedCategory === 'todos' 
    ? initialProducts 
    : initialProducts.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans pb-20">
      
      {/* Header con botón para abrir carrito */}
      <Header onOpenCart={() => setIsCartOpen(true)} />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 space-y-6">
        <CategoryNav 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />

        {/* Al hacer clic: guarda el producto Y abre el CartDrawer */}
        <ProductGrid 
          products={filteredProducts} 
          onAddToCart={(product) => {
            addToCart(product);   // 1. Agrega al carrito
            setIsCartOpen(true);  // 2. Despliega el carrito
          }} 
        />
      </main>

      {/* Panel del Carrito con Delivery por KM */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      <WhatsAppFab />
    </div>
  );
}