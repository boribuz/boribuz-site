"use client";

import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Authentic Bengali Cuisine
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the rich flavors and traditional recipes passed down through generations
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/menu"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold"
            >
              Explore Menu
            </Link>
            <Link 
              href="/order"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-4 rounded-full text-lg font-semibold"
            >
              Order Now
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold mb-4">Boribuz</h3>
          <p className="text-gray-400 mb-6">Authentic Bengali Restaurant</p>
          <p className="text-gray-400">© 2024 Boribuz. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
