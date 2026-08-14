import React, { useState } from 'react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import WhatsAppFab from './components/WhatsAppFab';
import { products as initialProducts } from './data/products';

export default function App() {
  // Estado para controlar la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState('todos');
  
  // Estado para abrir/cerrar el carrito (CartDrawer)
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filtrado de productos según la categoría activa
  const filteredProducts = selectedCategory === 'todos' 
    ? initialProducts 
    : initialProducts.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans pb-20">
      
      {/* 1. Encabezado con Logo y botón del carrito */}
      <Header onOpenCart={() => setIsCartOpen(true)} />

      {/* 2. Navegación por Categorías */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 space-y-6">
        <CategoryNav 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />

        {/* 3. Parrilla de Productos con apertura automática del carrito */}
        <ProductGrid 
          products={filteredProducts} 
          onAddToCart={(product) => {
            // Nota: Si usas CartContext, addToCart vendrá del hook.
            // Si manejas el estado del carrito aquí en App.jsx, agrega la lógica de agregar al arreglo.
            
            // Forzamos a que el panel del carrito se abra en pantalla:
            setIsCartOpen(true);
          }} 
        />
      </main>

      {/* 4. Panel desplegable del Carrito con Delivery por KM */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      {/* 5. Botón flotante de WhatsApp */}
      <WhatsAppFab />
    </div>
  );
}