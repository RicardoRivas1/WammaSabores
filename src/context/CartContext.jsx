import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTasaBCV } from '../utils/bcv';

const CartContext = createContext();

function getCartItemId(product, selectedContornos) {
  if (!product.hasContornos || !selectedContornos) return product.id;
  const sorted = [...selectedContornos].sort();
  if (!sorted[0] && !sorted[1]) return product.id;
  return `${product.id}|${sorted[0]}|${sorted[1]}`;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('wamma_cart');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return parsed.map((item) => ({
      ...item,
      cartItemId: item.cartItemId || getCartItemId(item, item.selectedContornos),
      customContornosText: item.customContornosText || ['', ''],
    }));
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
    const initialContornos = product.hasContornos ? ['', ''] : undefined;
    const cartItemId = getCartItemId(product, initialContornos);

    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          ...product,
          cartItemId,
          quantity: 1,
          selectedContornos: initialContornos,
          customContornosText: product.hasContornos ? ['', ''] : undefined,
        },
      ];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    setCart((prevCart) => {
      if (newQuantity <= 0) {
        return prevCart.filter((item) => item.cartItemId !== cartItemId);
      }
      return prevCart.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const updateContornos = (currentCartItemId, index, value, customText) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.cartItemId !== currentCartItemId) return item;

        const currentContornos = item.selectedContornos
          ? [...item.selectedContornos]
          : ['', ''];
        currentContornos[index] = value;

        const currentCustom = item.customContornosText
          ? [...item.customContornosText]
          : ['', ''];
        if (value === 'OTROS' && customText !== undefined) {
          currentCustom[index] = customText;
        } else if (value !== 'OTROS') {
          currentCustom[index] = '';
        }

        const newCartItemId = getCartItemId(item, currentContornos);

        return {
          ...item,
          cartItemId: newCartItemId,
          selectedContornos: currentContornos,
          customContornosText: currentCustom,
        };
      })
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateContornos,
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