
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

  // guardar en localStorage cuando cambie el carrito
  useEffect(() => {
    localStorage.setItem('wamma_cart', JSON.stringify(cart));
  }, [cart]);

  // tasa BCV
  useEffect(() => {
    getTasaBCV().then((tasa) => setTasaBcv(tasa));
  }, []);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) 
    );
  };
        filter(Boolean)

  const clearCart = () => setCart([]);

  const totalUSD = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalVES = totalUSD * tasaBcv;
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        tasaBcv,
        totalUSD,
        totalVES,
        itemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);