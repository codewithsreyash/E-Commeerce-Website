/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const item = localStorage.getItem('storefront_cart');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.warn("Failed to load cart from local storage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('storefront_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.productId === product.productId);
      if (existing) {
        return prevCart.map((item) =>
          item.product.productId === product.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter((item) => item.product.productId !== productId);
      }
      return prevCart.map((item) =>
        item.product.productId === productId ? { ...item, quantity } : item
      );
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const cartSubtotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartItemCount,
    cartSubtotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
