import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTasaBCV } from '../utils/bcv';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('wamma_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [tasaBcv, setTasaBcv] = useState(36.50);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Guardar en localStorage cuando cambie el carrito
  useEffect(() => {
    localStorage.setItem('wamma_cart', JSON.stringify(cart));
  }, [cart]);

  // Tasa BCV
  useEffect(() => {
    getTasaBCV().then((tasa) => setTasaBcv(tasa));
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQuantity) => {
  setCart((prevCart) => {
    if (newQuantity <= 0) {
      return prevCart.filter((item) => item.id !== id);
    }
    return prevCart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
  });
};

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        tasaBcv,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}