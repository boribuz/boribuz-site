"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SafeImage from '../_components/SafeImage';
import MenuItemModal from '../_components/MenuItemModal';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  imageUrl?: string;
  isVegetarian?: boolean;
  isSpicy?: boolean;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>(['all']);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    // Load menu from database API
    const loadMenuFromDatabase = async () => {
      try {
        setIsLoading(true);
        
        // Load both menu items and categories from admin API
        const [menuResponse, adminResponse] = await Promise.all([
          fetch('/api/menu'),
          fetch('/api/admin/menu')
        ]);
        
        const menuResult = await menuResponse.json();
        const adminResult = await adminResponse.json();
        
        if (menuResult.success && menuResult.data) {
          const menuData = menuResult.data;
          setMenuItems(menuData);
          
          // Use admin-created categories if available, otherwise fall back to menu item categories
          if (adminResult.success && adminResult.data.categories && adminResult.data.categories.length > 0) {
            const categoryNames = adminResult.data.categories
              .sort((a: any, b: any) => a.order - b.order)
              .map((cat: any) => cat.name);
            setCategories(['all', ...categoryNames]);
          } else {
            // Extract unique categories from menu items as fallback
            const uniqueCategories: string[] = Array.from(new Set(menuData.map((item: MenuItem) => item.category)));
            setCategories(['all', ...uniqueCategories]);
          }
        } else {
          // Fallback to default menu if API fails
          const defaultMenu = getDefaultMenu();
          setMenuItems(defaultMenu);
          const uniqueCategories = Array.from(new Set(defaultMenu.map(item => item.category)));
          setCategories(['all', ...uniqueCategories]);
        }
      } catch (e) {
        console.error('Error loading menu from database:', e);
        // Fallback to default menu
        const defaultMenu = getDefaultMenu();
        setMenuItems(defaultMenu);
        const uniqueCategories = Array.from(new Set(defaultMenu.map(item => item.category)));
        setCategories(['all', ...uniqueCategories]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMenuFromDatabase();
  }, []);

  const getDefaultMenu = (): MenuItem[] => [
    {
      id: '1',
      name: 'Chicken Biryani',
      description: 'Fragrant basmati rice with tender chicken and aromatic spices',
      price: 18.99,
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1563379091339-03246283ad67?w=400&h=300&fit=crop',
      isSpicy: true
    },
    {
      id: '2',
      name: 'Fish Curry',
      description: 'Traditional Bengali fish curry with mustard oil and spices',
      price: 22.99,
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=300&fit=crop',
      isSpicy: true
    },
    {
      id: '3',
      name: 'Roshogolla',
      description: 'Soft, spongy cottage cheese balls in sweet syrup',
      price: 8.99,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1599043513900-ed6fe01d3833?w=400&h=300&fit=crop'
    },
    {
      id: '4',
      name: 'Dal Tadka',
      description: 'Yellow lentils tempered with cumin and garlic',
      price: 12.99,
      category: 'Vegetarian',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop',
      isVegetarian: true
    },
    {
      id: '5',
      name: 'Mutton Curry',
      description: 'Tender goat meat cooked in traditional Bengali spices',
      price: 26.99,
      category: 'Main Course',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
      isSpicy: true
    },
    {
      id: '6',
      name: 'Mishti Doi',
      description: 'Sweet yogurt, a traditional Bengali dessert',
      price: 6.99,
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop'
    }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Menu</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our authentic Bengali dishes, each prepared with traditional recipes and the finest ingredients
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Items' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <span className="ml-4 text-gray-600">Loading menu...</span>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <SafeImage
                    src={item.image || item.imageUrl}
                    alt={item.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    <div className="flex gap-2">
                      {item.isVegetarian && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Vegetarian
                        </span>
                      )}
                      {item.isSpicy && (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                          Spicy
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-500">${item.price}</span>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            </div>
          )}

          {!isLoading && filteredItems.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">No items found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Order?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Experience these authentic flavors delivered right to your door
          </p>
          <Link 
            href="/order"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-colors shadow-lg inline-block"
          >
            Order Online Now
          </Link>
        </div>
      </section>

      {/* Menu Item Modal */}
      <MenuItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
