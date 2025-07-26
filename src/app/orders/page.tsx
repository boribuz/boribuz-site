"use client";

import React, { useState, useEffect } from 'react';
import { useRequireAuth } from '../_components/UnifiedAuthContext';
import { useCart } from '../_components/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface OrderItem {
  menuItemId?: number;
  id?: number;
  name?: string;
  price: number;
  quantity: number;
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
  available?: boolean;
}

interface Order {
  id: number;
  items: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
  status: string;
  createdAt: string;
}

export default function OrderHistoryPage() {
  const { user, isLoading: authLoading } = useRequireAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reorderLoading, setReorderLoading] = useState<number | null>(null);
  const [reorderError, setReorderError] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders/user');
      const data = await response.json();

      if (response.ok) {
        setOrders(data);
      } else {
        setError(data.error || 'Failed to fetch orders');
      }
    } catch {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const calculateOrderTotal = (itemsString: string) => {
    try {
      const items: OrderItem[] = JSON.parse(itemsString);
      return items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    } catch {
      return '0.00';
    }
  };

  const parseOrderItems = (itemsString: string) => {
    try {
      return JSON.parse(itemsString);
    } catch {
      return [];
    }
  };

  const handleReorder = async (orderId: number, itemsString: string) => {
    setReorderLoading(orderId);
    setReorderError('');
    
    try {
      const orderItems = parseOrderItems(itemsString);
      
      if (orderItems.length === 0) {
        throw new Error('No items found in this order');
      }

      // Fetch current menu to validate items
      const menuResponse = await fetch('/api/menu');
      if (!menuResponse.ok) {
        throw new Error('Failed to fetch current menu');
      }
      
      const currentMenu: MenuItem[] = await menuResponse.json();
      const menuMap = new Map(currentMenu.map(item => [item.id, item]));
      
      const validatedItems: {item: MenuItem, quantity: number, priceChanged: boolean}[] = [];
      const unavailableItems: string[] = [];
      
      // Validate each order item against current menu
      for (const orderItem of orderItems) {
        const itemId = orderItem.menuItemId || orderItem.id;
        const currentMenuItem = menuMap.get(itemId);
        
        if (!currentMenuItem) {
          unavailableItems.push(orderItem.name || `Item #${itemId}`);
          continue;
        }
        
        // Check if item is available (if availability field exists)
        if (currentMenuItem.available === false) {
          unavailableItems.push(currentMenuItem.name);
          continue;
        }
        
        const priceChanged = Math.abs(currentMenuItem.price - orderItem.price) > 0.01;
        validatedItems.push({
          item: currentMenuItem,
          quantity: orderItem.quantity,
          priceChanged
        });
      }
      
      // If any items are unavailable, show error
      if (unavailableItems.length > 0) {
        throw new Error(`The following items are no longer available: ${unavailableItems.join(', ')}`);
      }
      
      // If no valid items, show error
      if (validatedItems.length === 0) {
        throw new Error('None of the items from this order are currently available');
      }
      
      // Add validated items to cart
      for (const {item, quantity} of validatedItems) {
        for (let i = 0; i < quantity; i++) {
          addToCart({
            id: item.id,
            name: item.name,
            price: item.price // Use current price
          });
        }
      }
      
      // Show success message if prices changed
      const priceChangedItems = validatedItems.filter(v => v.priceChanged);
      if (priceChangedItems.length > 0) {
        const itemNames = priceChangedItems.map(v => v.item.name).join(', ');
        // We'll show this as a temporary success message
        setReorderError(`Items added to cart! Note: Prices have been updated for: ${itemNames}`);
        setTimeout(() => setReorderError(''), 5000);
      }
      
      // Navigate to cart
      router.push('/cart');
      
    } catch (error) {
      console.error('Error reordering:', error);
      setReorderError(error instanceof Error ? error.message : 'Failed to reorder items');
    } finally {
      setReorderLoading(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-white">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={fetchOrders}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Order History</h1>
        <p className="text-gray-300">View all your past orders</p>
      </div>

      {/* Error display for reorder issues */}
      {reorderError && (
        <div className={`mb-6 p-4 rounded-lg ${
          reorderError.includes('added to cart') 
            ? 'bg-green-100 border border-green-400 text-green-700'
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          <div className="flex justify-between items-start">
            <p className="text-sm">{reorderError}</p>
            <button 
              onClick={() => setReorderError('')}
              className="text-lg font-bold leading-none hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium">No orders yet</h3>
            <p className="text-sm mt-2">Start by browsing our delicious menu!</p>
          </div>
          <Link
            href="/menu"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const items = parseOrderItems(order.items);
            const total = calculateOrderTotal(order.items);
            
            return (
              <div key={order.id} className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Order #{order.id}</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400 text-sm">
                      Order placed
                    </div>
                    <p className="text-white font-semibold mt-2 text-lg">${total}</p>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <h4 className="text-white font-medium mb-2">Items:</h4>
                  <div className="space-y-2">
                    {items.map((item: OrderItem, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-300">
                          {item.quantity}x {item.name || `Item ID ${item.id || item.menuItemId}`}
                        </span>
                        <span className="text-gray-300">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Customer:</span>
                      <p className="text-white">{order.customerName}</p>
                      <p className="text-gray-300">{order.customerPhone}</p>
                      {order.customerEmail && <p className="text-gray-300">{order.customerEmail}</p>}
                    </div>
                    {order.notes && (
                      <div>
                        <span className="text-gray-400">Notes:</span>
                        <p className="text-gray-300">{order.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => handleReorder(order.id, order.items)}
                    disabled={reorderLoading === order.id}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-2 rounded text-sm transition-colors flex items-center gap-2"
                  >
                    {reorderLoading === order.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Reordering...
                      </>
                    ) : (
                      'Reorder'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
