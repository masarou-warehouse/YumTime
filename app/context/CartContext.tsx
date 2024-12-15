// CartContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('@cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
      } catch (error) {
        console.log('Error loading cart:', error);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('@cart', JSON.stringify(cartItems));
      } catch (error) {
        console.log('Error saving cart:', error);
      }
    };

    saveCart();
  }, [cartItems]);

  const addToCart = (item: FoodItem) => {
    setCartItems(prevItems => [...prevItems, item]);
  };

  const removeFromCart = (item: FoodItem) => {
    setCartItems(prevItems => prevItems.filter(cartItem => cartItem.name !== item.name));
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