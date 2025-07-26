"use client";

import { useCart } from './CartContext';
import { useNotification } from './NotificationContext';
import { useEffect, useRef } from 'react';

export function CartNotificationWrapper({ children }: { children: React.ReactNode }) {
  const { cart } = useCart();
  const { addNotification } = useNotification();
  const prevCartRef = useRef(cart);

  useEffect(() => {
    const prevCart = prevCartRef.current;
    const currentCart = cart;

    // Check if an item was added (cart length increased or quantity increased)
    if (currentCart.length > prevCart.length) {
      // New item added
      const newItem = currentCart[currentCart.length - 1];
      addNotification(`${newItem.name} added to cart!`, 'success');
    } else if (currentCart.length === prevCart.length) {
      // Check if any quantity increased
      currentCart.forEach((currentItem) => {
        const prevItem = prevCart.find(p => p.id === currentItem.id);
        if (prevItem && currentItem.quantity > prevItem.quantity) {
          addNotification(`Added another ${currentItem.name} to cart!`, 'success');
        }
      });
    }

    prevCartRef.current = [...currentCart];
  }, [cart, addNotification]);

  return <>{children}</>;
}
