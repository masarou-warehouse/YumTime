// CartContext.tsx
import React, { createContext, useState, useContext } from 'react';
import { FoodItem } from '../navigations/type';

type CartContextType = {
  cartItems: FoodItem[];
  addToCart: (item: FoodItem) => void;
  removeFromCart: (item: FoodItem) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<FoodItem[]>([]);

  const addToCart = (item: FoodItem) => {
    setCartItems([...cartItems, item]);
  };

  const removeFromCart = (item: FoodItem) => {
    setCartItems(cartItems.filter(cartItem => cartItem.name !== item.name));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);