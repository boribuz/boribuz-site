"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  specialInstructions?: string;
  selectedOptions?: string[];
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  function addToCart(item: Omit<CartItem, 'quantity'>) {
    setCart((prev) => {
      // Create a unique identifier for items with special instructions or options
      const itemKey = `${item.id}-${item.specialInstructions || ''}-${(item.selectedOptions || []).join(',')}`;
      
      const existing = prev.find((i) => {
        const existingKey = `${i.id}-${i.specialInstructions || ''}-${(i.selectedOptions || []).join(',')}`;
        return existingKey === itemKey;
      });
      
      if (existing) {
        return prev.map((i) => {
          const existingKey = `${i.id}-${i.specialInstructions || ''}-${(i.selectedOptions || []).join(',')}`;
          return existingKey === itemKey ? { ...i, quantity: i.quantity + 1 } : i;
        });
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeFromCart(id: number) {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }

  function updateQuantity(id: number, quantity: number) {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i)).filter((i) => i.quantity > 0)
    );
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
} 