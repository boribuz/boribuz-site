"use client";

import React from 'react';
import SafeImage from './SafeImage';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

interface MenuItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MenuItemModal({ item, isOpen, onClose }: MenuItemModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="aspect-[4/3] overflow-hidden">
          <SafeImage
            src={item.image}
            alt={item.name}
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and Badges */}
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{item.name}</h2>
            <div className="flex flex-col gap-2 ml-4">
              {item.isVegetarian && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                  Vegetarian
                </span>
              )}
              {item.isSpicy && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                  Spicy
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>

          {/* Price and Category */}
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-orange-500">${item.price}</span>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {item.category}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
