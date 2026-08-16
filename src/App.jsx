import React, { useState } from 'react';
import { useCart } from './context/CartContext';
import SearchBar from './components/SearchBar';
import CategoryNav from './components/CategoryNav';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import Header from './components/Header';
import { PRODUCTS } from './data/products';
import Footer from './components/Footer';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para Observaciones y Delivery (¡Mantenidos intactos!)
  const [orderNotes, setOrderNotes] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('delivery'); // 'delivery' o 'pickup'
  const [address, setAddress] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { addToCart, cart = [], tasaBcv, updateQuantity } = useCart();

  // Total de productos en el carrito
  const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  // Filtrado por Categoría + Búsqueda
  const filteredProducts = PRODUCTS.filter((product) => {
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

  // Envío a WhatsApp con Delivery + Observaciones + Totales
  const handleWhatsAppClick = () => {
    const subtotalUSD = cart.reduce((sum, item) => {
      const price = Number(String(item.price).replace(/[^0-9.-]+/g, '')) || 0;
      return sum + price * (item.quantity || 1);
    }, 0);

    let message = `🛒 *NUEVO PEDIDO - WAMMA SABORES*\n\n`;

    // Lista de productos
    cart.forEach((item) => {
      message += `• ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });

    // Información de Delivery / Pick-up
    message += `\n🛵 *Tipo de Entrega:* ${deliveryOption === 'delivery' ? 'Delivery' : 'Retiro en Local (Pick-up)'}\n`;
    if (deliveryOption === 'delivery' && address.trim() !== '') {
      message += `📍 *Dirección:* ${address.trim()}\n`;
    }

    // Observaciones / Quitar ingredientes
    if (orderNotes && orderNotes.trim() !== '') {
      message += `\n📌 *Observaciones / Sin ingredientes:* \n_${orderNotes.trim()}_\n`;
    }

    // Totales
    message += `\n💰 *Total USD:* $${subtotalUSD.toFixed(2)}`;
    if (tasaBcv) {
      message += `\n🇻🇪 *Total VES:* Bs. ${(subtotalUSD * tasaBcv).toFixed(2)} (Tasa BCV: ${tasaBcv})`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/584242608180?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans pb-28 relative">
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
          onAddToCart={handleAddToCart}
        />
      </main>

      {/* --- BOTONES FLOTANTES DE NAVEGACIÓN Y WHATSAPP --- */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/90 to-transparent z-40 flex flex-col gap-2 max-w-2xl mx-auto">
        {totalItems > 0 && (
          <div className="flex justify-end">
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-sm transition-all animate-bounce"
            >
              <span>🛒 Ver Pedido</span>
              <span className="bg-black text-amber-400 text-xs px-2 py-0.5 rounded-full font-bold">
                {totalItems}
              </span>
            </button>
          </div>
        )}

        <button
          onClick={handleWhatsAppClick}
          className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-xl"
        >
          <span>💬</span> Pedir o Consultar por WhatsApp
        </button>
      </div>

      {/* Drawer del Carrito completo con Delivery y Observaciones */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        orderNotes={orderNotes}
        setOrderNotes={setOrderNotes}
        deliveryOption={deliveryOption}
        setDeliveryOption={setDeliveryOption}
        address={address}
        setAddress={setAddress}
        onSendWhatsApp={handleWhatsAppClick}
        tasaBcv={tasaBcv}
      />
    
     <Footer />
  </div>

  );
}