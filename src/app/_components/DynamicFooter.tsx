"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface RestaurantInfo {
  name: string;
  tagline: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website: string;
  };
  orderingLinks: {
    uberEats: string;
    skipTheDishes: string;
  };
  footer?: {
    description: string;
    socialLinks: {
      facebook: string;
      instagram: string;
      twitter: string;
    };
    copyrightText: string;
  };
}

export default function DynamicFooter() {
  const [restaurantInfo, setRestaurantInfo] = useState<RestaurantInfo>({
    name: 'Boribuz',
    tagline: 'Authentic Bengali Cuisine',
    description: 'Experience the rich flavors and traditional recipes of Bangladesh. Fresh ingredients, authentic spices, and generations of culinary expertise.',
    address: {
      street: '123 Bengali Street',
      city: 'Toronto',
      state: 'ON',
      zipCode: 'M1M 1M1',
      country: 'Canada'
    },
    contact: {
      phone: '(416) 555-BORI',
      email: 'info.boribuz@gmail.com',
      website: 'www.boribuz.com'
    },
    orderingLinks: {
      uberEats: '',
      skipTheDishes: ''
    },
    footer: {
      description: 'Experience the rich flavors and traditional recipes of Bangladesh. Fresh ingredients, authentic spices, and generations of culinary expertise.',
      socialLinks: {
        facebook: '',
        instagram: '',
        twitter: ''
      },
      copyrightText: '© 2024 Boribuz. All rights reserved.'
    }
  });

  useEffect(() => {
    // Load restaurant info from API
    const loadRestaurantInfo = async () => {
      try {
        const response = await fetch('/api/restaurant-info');
        const result = await response.json();
        
        if (result.success) {
          setRestaurantInfo(prev => ({
            ...prev,
            ...result.data
          }));
        }
      } catch (error) {
        console.error('Error loading restaurant info:', error);
      }
    };

    loadRestaurantInfo();

    // Listen for restaurant info updates
    const handleRestaurantInfoUpdate = () => {
      loadRestaurantInfo();
    };

    window.addEventListener('restaurantInfoUpdated', handleRestaurantInfoUpdate);

    return () => {
      window.removeEventListener('restaurantInfoUpdated', handleRestaurantInfoUpdate);
    };
  }, []);

  const getOrderingLinks = () => {
    const links = [];
    if (restaurantInfo?.orderingLinks?.uberEats) {
      links.push({ name: 'Uber Eats', url: restaurantInfo.orderingLinks.uberEats });
    }
    if (restaurantInfo?.orderingLinks?.skipTheDishes) {
      links.push({ name: 'Skip The Dishes', url: restaurantInfo.orderingLinks.skipTheDishes });
    }
    return links;
  };

  return (
    <footer className="bg-black text-white py-12 px-4 mt-16 border-t border-orange-500/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-orange-500 p-2 rounded-lg">
                <span className="text-black font-bold text-lg">{restaurantInfo.name.charAt(0)}</span>
              </div>
              <div>
                <div className="font-bold text-2xl text-white">{restaurantInfo.name}</div>
                <div className="text-orange-300 text-sm">{restaurantInfo.tagline}</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              {restaurantInfo.description}
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block text-gray-400 hover:text-orange-500 transition-colors">Home</Link>
              <Link href="/menu" className="block text-gray-400 hover:text-orange-500 transition-colors">Menu</Link>
              <Link href="/about" className="block text-gray-400 hover:text-orange-500 transition-colors">About Us</Link>
              {getOrderingLinks().length > 0 && (
                <>
                  <div className="pt-2 text-gray-500">Order Online:</div>
                  {getOrderingLinks().map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-gray-400 hover:text-orange-500 transition-colors pl-2"
                    >
                      {link.name}
                    </a>
                  ))}
                </>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Contact Info</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div>{restaurantInfo.address.street}</div>
              <div>{restaurantInfo.address.city}, {restaurantInfo.address.state} {restaurantInfo.address.zipCode}</div>
              <div>{restaurantInfo.contact.phone}</div>
              <a href={`mailto:${restaurantInfo.contact.email}`} className="hover:text-orange-500 transition-colors">
                {restaurantInfo.contact.email}
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400">
            {restaurantInfo.footer?.copyrightText || `© 2025 ${restaurantInfo.name}. All rights reserved.`}
          </div>
          
          {/* Social Media Links */}
          {(restaurantInfo.footer?.socialLinks?.facebook || restaurantInfo.footer?.socialLinks?.instagram || restaurantInfo.footer?.socialLinks?.twitter) && (
            <div className="flex space-x-4 mt-4 md:mt-0">
              {restaurantInfo.footer.socialLinks.facebook && (
                <a 
                  href={restaurantInfo.footer.socialLinks.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Facebook
                </a>
              )}
              {restaurantInfo.footer.socialLinks.instagram && (
                <a 
                  href={restaurantInfo.footer.socialLinks.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Instagram
                </a>
              )}
              {restaurantInfo.footer.socialLinks.twitter && (
                <a 
                  href={restaurantInfo.footer.socialLinks.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-500 transition-colors"
                >
                  Twitter
                </a>
              )}
            </div>
          )}
          
          {/* Fallback if no social links */}
          {!(restaurantInfo.footer?.socialLinks?.facebook || restaurantInfo.footer?.socialLinks?.instagram || restaurantInfo.footer?.socialLinks?.twitter) && (
            <div className="text-sm text-gray-400 mt-2 md:mt-0">
              Made with care for Bengali food lovers.
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
