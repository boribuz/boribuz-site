"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface OrderingLinks {
  uberEats: string;
  skipTheDishes: string;
}

interface RestaurantInfo {
  name: string;
  tagline: string;
  orderingLinks: OrderingLinks;
}

export default function OrderOnlinePage() {
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: 'Boribuz',
    tagline: 'Authentic Bengali Cuisine',
    orderingLinks: {
      uberEats: 'https://ubereats.com',
      skipTheDishes: 'https://skipthedishes.com'
    }
  });

  useEffect(() => {
    const loadRestaurantInfo = async () => {
      try {
        const response = await fetch('/api/restaurant-info');
        const result = await response.json();
        
        if (result.success) {
          setRestaurantInfo({
            name: result.data.name || 'Boribuz',
            tagline: result.data.tagline || 'Authentic Bengali Cuisine',
            orderingLinks: {
              uberEats: result.data.orderingLinks?.uberEats || 'https://ubereats.com',
              skipTheDishes: result.data.orderingLinks?.skipTheDishes || 'https://skipthedishes.com'
            }
          });
        }
      } catch (error) {
        console.error('Error loading restaurant info:', error);
      }
    };

    loadRestaurantInfo();

    const handleUpdate = () => {
      loadRestaurantInfo();
    };

    window.addEventListener('restaurantInfoUpdated', handleUpdate);

    return () => {
      window.removeEventListener('restaurantInfoUpdated', handleUpdate);
    };
  }, []);

  const handlePlatformClick = (url: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/" className="inline-block mb-8">
            <h1 className="text-4xl font-bold text-gray-900 hover:text-orange-600 transition-colors">
              {restaurantInfo.name}
            </h1>
          </Link>
          <h2 className="text-6xl font-bold text-gray-900 mb-6">
            Order Online
          </h2>
          <p className="text-2xl text-gray-600 mb-12">
            Get {restaurantInfo.tagline.toLowerCase()} delivered to your door
          </p>
        </div>
      </section>

      {/* Delivery Platforms */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Uber Eats */}
            <div 
              onClick={() => handlePlatformClick(restaurantInfo.orderingLinks.uberEats)}
              className="group cursor-pointer bg-white rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 hover:border-green-200"
            >
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-black rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Uber Eats</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Fast delivery with real-time tracking
                </p>
                <div className="bg-black text-white px-8 py-4 rounded-full font-semibold text-lg group-hover:bg-gray-800 transition-colors">
                  Order Now →
                </div>
              </div>
            </div>

            {/* Skip The Dishes */}
            <div 
              onClick={() => handlePlatformClick(restaurantInfo.orderingLinks.skipTheDishes)}
              className="group cursor-pointer bg-white rounded-3xl p-12 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 hover:border-red-200"
            >
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Skip The Dishes</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Canada&apos;s favorite delivery service
                </p>
                <div className="bg-red-500 text-white px-8 py-4 rounded-full font-semibold text-lg group-hover:bg-red-600 transition-colors">
                  Order Now →
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Order Online */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Order Online?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h4>
              <p className="text-gray-600">Get your food delivered hot and fresh in 30-45 minutes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Easy Ordering</h4>
              <p className="text-gray-600">Simple, secure checkout with multiple payment options</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Track Your Order</h4>
              <p className="text-gray-600">Real-time updates from kitchen to your doorstep</p>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Menu */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Want to See Our Menu First?
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Browse our delicious Bengali dishes before placing your order
          </p>
          <Link 
            href="/menu"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors shadow-lg inline-block"
          >
            View Menu
          </Link>
        </div>
      </section>
    </div>
  );
}
