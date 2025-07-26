"use client";

import React from 'react';
import Link from 'next/link';
import SafeImage from './_components/SafeImage';

export default function HomePage() {
  // Static content - no more dynamic loading
  const content = {
    'hero-title': 'Authentic Bengali Cuisine',
    'hero-subtitle': 'Experience the rich flavors and traditional recipes passed down through generations'
  };

  const restaurantInfo = {
    name: 'Boribuz',
    tagline: 'Authentic Bengali Cuisine',
    phone: '(555) 123-4567',
    email: 'info@boribuz.com',
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001'
    },
    footer: {
      description: 'Bringing authentic Bengali flavors to your table with love and tradition.',
      socialLinks: {
        facebook: '',
        instagram: '',
        twitter: ''
      },
      copyrightText: '© 2024 Boribuz. All rights reserved.'
    }
  };

  // Static hero image
  const heroImage = 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=1920&h=1080&fit=crop';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <SafeImage
            src={heroImage}
            alt="Bengali Cuisine"
            width={1920}
            height={1080}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {content['hero-title']}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
            {content['hero-subtitle']}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/menu"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Explore Menu
            </Link>
            <Link 
              href="/order"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 border border-white/30"
            >
              Order Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Signature Dishes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most beloved traditional Bengali recipes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-6 shadow-lg">
                <SafeImage
                  src="https://images.unsplash.com/photo-1563379091339-03246283ad67?w=600&h=450&fit=crop"
                  alt="Chicken Biryani"
                  width={600}
                  height={450}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Chicken Biryani</h3>
              <p className="text-gray-600">Fragrant basmati rice with tender chicken and aromatic spices</p>
            </div>

            <div className="group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-6 shadow-lg">
                <SafeImage
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=450&fit=crop"
                  alt="Fish Curry"
                  width={600}
                  height={450}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Bengali Fish Curry</h3>
              <p className="text-gray-600">Fresh fish cooked in traditional Bengali spices and mustard oil</p>
            </div>

            <div className="group cursor-pointer">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-6 shadow-lg">
                <SafeImage
                  src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=450&fit=crop"
                  alt="Prawn Malai Curry"
                  width={600}
                  height={450}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Prawn Malai Curry</h3>
              <p className="text-gray-600">Jumbo prawns in creamy coconut curry with mild spices</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Authentic Bengali Heritage
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At {restaurantInfo.name}, we bring you the authentic flavors of Bangladesh through 
                time-honored recipes passed down through generations. Every dish is crafted with 
                love and the finest ingredients.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                From our fragrant biryanis to our traditional fish curries, each meal is a 
                celebration of Bengali culinary artistry.
              </p>
              <Link 
                href="/about"
                className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold text-lg"
              >
                Learn Our Story
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                <SafeImage
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop"
                  alt="Bengali Cooking"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white p-6 rounded-2xl shadow-xl">
                <div className="text-center">
                  <div className="text-3xl font-bold">25+</div>
                  <div className="text-sm">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-bold mb-6">Visit Us Today</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Address</h3>
                    <p className="text-gray-300">
                      {restaurantInfo.address.street}<br />
                      {restaurantInfo.address.city}, {restaurantInfo.address.state} {restaurantInfo.address.zipCode}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Phone</h3>
                    <p className="text-gray-300">{restaurantInfo.phone}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-orange-500 p-3 rounded-full">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Email</h3>
                    <p className="text-gray-300">{restaurantInfo.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-4xl font-bold mb-6">Hours</h2>
              <div className="bg-gray-800 rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                    <span className="font-medium">Monday - Thursday</span>
                    <span className="text-gray-300">11:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                    <span className="font-medium">Friday - Saturday</span>
                    <span className="text-gray-300">11:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Sunday</span>
                    <span className="text-gray-300">12:00 PM - 9:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
