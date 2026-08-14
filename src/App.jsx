import React, { useState } from 'react';
import { useCart } from './context/CartContext'; // 👈 IMPORTACIÓN CORREGIDA AQUÍ
import SearchBar from './components/SearchBar';
import CategoryNav from './components/CategoryNav';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import Header from './components/Header';
import { initialProducts } from './data/products';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { addToCart, cart, tasaBcv, updateQuantity } = useCart();

  const totalItems = cart ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

  // Filtrado por Categoría + Lupa
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

  // Envío a WhatsApp con las notas de ingredientes
  const handleWhatsAppClick = () => {
    const subtotalUSD = cart
      ? cart.reduce((sum, item) => {
          const price = Number(String(item.price).replace(/[^0-9.-]+/g, '')) || 0;
          return sum + price * (item.quantity || 1);
        }, 0)
      : 0;

    let message = `🛒 *NUEVO PEDIDO - WAMMA SABORES*\n\n`;

    cart.forEach((item) => {
      message += `• ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });

    if (orderNotes && orderNotes.trim() !== '') {
      message += `\n📌 *Observaciones / Sin ingredientes:* \n_${orderNotes.trim()}_\n`;
    }

    message += `\n💰 *Total USD:* $${subtotalUSD.toFixed(2)}`;
    if (tasaBcv) {
      message += `\n🇻🇪 *Total VES:* Bs. ${(subtotalUSD * tasaBcv).toFixed(2)} (Tasa BCV: ${tasaBcv})`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/TU_NUMERO_AQUI?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans pb-20">
      <Header />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 space-y-4">
        {/* Barra de Búsqueda / Lupa */}
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Categorías */}
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Productos */}
        <ProductGrid
          products={filteredProducts}
          onAddToCart={(product) => addToCart(product)}
        />
      </main>

      {/* Carrito */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        orderNotes={orderNotes}
        setOrderNotes={setOrderNotes}
        onSendWhatsApp={handleWhatsAppClick}
        tasaBcv={tasaBcv}
      />
    </div>
  );
}