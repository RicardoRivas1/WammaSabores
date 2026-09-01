import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getTasaBCV } from '../utils/bcv';
import { calculateKmFromCoords, getDeliveryPricing } from '../utils/deliveryUtils';

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

  // Ubicación de entrega persistida (coordenadas GPS + dirección)
  const [locationData, setLocationData] = useState(() => {
    const saved = localStorage.getItem('wamma_location');
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  });

  // Guardar en localStorage cuando cambie el carrito
  useEffect(() => {
    localStorage.setItem('wamma_cart', JSON.stringify(cart));
  }, [cart]);

  // Persistir la ubicación seleccionada
  useEffect(() => {
    if (locationData) {
      localStorage.setItem('wamma_location', JSON.stringify(locationData));
    } else {
      localStorage.removeItem('wamma_location');
    }
  }, [locationData]);

  // Información del delivery derivada de la ubicación confirmada
  const deliveryInfo = useMemo(() => {
    if (!locationData?.latitude || !locationData?.longitude) {
      return { costUSD: 0, distanceKm: null, zone: null };
    }

    const distanceKm = calculateKmFromCoords(
      locationData.latitude,
      locationData.longitude
    );
    const addressText =
      locationData.addressText ||
      `${locationData.building || ''} ${locationData.reference || ''}`.trim();
    const pricing = getDeliveryPricing({ distanceKm, addressText });

    return {
      costUSD: pricing.price,
      distanceKm: pricing.distanceKm,
      zone: pricing.zone,
    };
  }, [locationData]);

  // Tasa BCV
  useEffect(() => {
    getTasaBCV().then((tasa) => setTasaBcv(tasa));
  }, []);

  const addToCart = (product) => {
    const initialContornos = product.hasContornos ? ['', ''] : undefined;
    const cartItemId = `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    setCart((prev) => [
      ...prev,
      {
        ...product,
        cartItemId,
        quantity: 1,
        selectedContornos: initialContornos,
        customContornosText: product.hasContornos ? ['', ''] : undefined,
      },
    ]);
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
        locationData,
        setLocationData,
        deliveryCostUSD: deliveryInfo.costUSD,
        deliveryDistanceKm: deliveryInfo.distanceKm,
        deliveryZone: deliveryInfo.zone,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}