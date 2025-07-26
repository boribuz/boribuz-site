"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useRequireAdminAuth } from '../../_components/UnifiedAuthContext';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  imageUrl?: string;
  available: boolean;
  featured: boolean;
}

interface Category {
  id: string;
  name: string;
  description: string;
  order: number;
}

export default function MenuManagementPage() {
  const { user, isLoading, hasAccess, shouldRedirect } = useRequireAdminAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    // Only load menu data if user has access
    if (hasAccess) {
      loadMenuData();
    }
  }, [hasAccess]);

  const loadMenuData = async () => {
    try {
      const response = await fetch('/api/admin/menu');
      const result = await response.json();
      
      if (result.success) {
        setMenuItems(result.data.menuItems || []);
        setCategories(result.data.categories || []);
      }
    } catch (e) {
      console.error('Error loading menu data:', e);
    }
  };

  const saveMenuItem = async (item: MenuItem) => {
    try {
      // Validate required fields on client side
      if (!item.name || !item.description || !item.price || !item.category) {
        alert('Please fill in all required fields: name, description, price, and category');
        return;
      }

      const isEditing = editingItem && editingItem.id === item.id;
      const url = '/api/admin/menu';
      const method = isEditing ? 'PUT' : 'POST';
      
      // Generate a proper itemId if creating new item
      const itemData = {
        type: 'menu-item',
        id: item.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        itemId: item.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: item.name,
        description: item.description,
        price: parseFloat(item.price.toString()),
        category: item.category,
        image: item.image || null,
        imageUrl: item.imageUrl || null,
        available: item.available !== false,
        featured: item.featured || false
      };

      console.log('Sending menu item data:', itemData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      const result = await response.json();
      console.log('Menu item save result:', result);
      
      if (result.success) {
        // Reload menu data
        const menuResponse = await fetch('/api/admin/menu');
        const menuResult = await menuResponse.json();
        if (menuResult.success) {
          setMenuItems(menuResult.data.menuItems || []);
        }
        
        setEditingItem(null);
        setShowItemForm(false);
      } else {
        alert('Error saving menu item: ' + result.error);
      }
    } catch (e) {
      console.error('Error saving menu item:', e);
      alert('Network error while saving menu item');
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/menu?type=menu-item&id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        setMenuItems(menuItems.filter(item => item.id !== id));
      } else {
        alert('Error deleting menu item: ' + result.error);
      }
    } catch (e) {
      console.error('Error deleting menu item:', e);
      alert('Network error while deleting menu item');
    }
  };

  const saveCategory = async (category: Category) => {
    try {
      // Validate required fields
      if (!category.name) {
        alert('Category name is required');
        return;
      }

      const isEditing = editingCategory && editingCategory.id === category.id;
      const url = '/api/admin/menu';
      const method = isEditing ? 'PUT' : 'POST';
      
      // Generate a proper categoryId if creating new category
      const categoryData = {
        type: 'category',
        id: category.id || `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        categoryId: category.id || `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: category.name,
        description: category.description || '',
        order: category.order || 0
      };

      console.log('Sending category data:', categoryData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      const result = await response.json();
      console.log('Category save result:', result);
      
      if (result.success) {
        // Reload menu data
        const menuResponse = await fetch('/api/admin/menu');
        const menuResult = await menuResponse.json();
        if (menuResult.success) {
          setCategories(menuResult.data.categories || []);
        }
        
        setEditingCategory(null);
        setShowCategoryForm(false);
      } else {
        alert('Error saving category: ' + result.error);
      }
    } catch (e) {
      console.error('Error saving category:', e);
      alert('Network error while saving category');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/menu?type=category&id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        setCategories(categories.filter(cat => cat.id !== id));
      } else {
        alert('Error deleting category: ' + result.error);
      }
    } catch (e) {
      console.error('Error deleting category:', e);
      alert('Network error while deleting category');
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Checking authentication...</div>
      </div>
    );
  }

  // Show access denied if not authorized
  if (shouldRedirect || !hasAccess) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-4">You need admin privileges to access this page.</p>
          <p className="text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 bg-black min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Restaurant Admin Panel</h1>
              <p className="text-gray-400">Manage your restaurant menu items and categories</p>
              <p className="text-sm text-orange-400 mt-1">This is the only admin functionality available - menu management only</p>
              <p className="text-sm text-gray-500 mt-1">Logged in as: {user?.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-900 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('items')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'items'
                ? 'bg-orange-500 text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Menu Items ({menuItems.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 rounded-md font-medium transition-all ${
              activeTab === 'categories'
                ? 'bg-orange-500 text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Categories ({categories.length})
          </button>
        </div>

        {/* Menu Items Tab */}
        {activeTab === 'items' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Menu Items</h2>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setShowItemForm(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-black font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Add New Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map(item => (
                <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                  {/* Image Section */}
                  {(item.image || item.imageUrl) ? (
                    <div className="relative h-48 overflow-hidden group">
                      <img
                        src={item.image || item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setShowItemForm(true);
                          }}
                          className="bg-orange-500 hover:bg-orange-600 text-black px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Change Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-800 flex items-center justify-center group cursor-pointer"
                         onClick={() => {
                           setEditingItem(item);
                           setShowItemForm(true);
                         }}>
                      <div className="text-center">
                        <svg className="w-12 h-12 text-gray-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 text-sm">Click to add image</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-1">{item.name}</h3>
                        <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-orange-500 font-bold">${item.price}</span>
                          <span className="text-gray-500 text-sm">•</span>
                          <span className="text-gray-400 text-sm capitalize">{item.category}</span>
                        </div>
                        <div className="flex space-x-2">
                          {item.available && (
                            <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">
                              Available
                            </span>
                          )}
                          {item.featured && (
                            <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs">
                              Featured
                            </span>
                          )}
                          {!item.available && (
                            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">
                              Unavailable
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-4 border-t border-gray-800">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setShowItemForm(true);
                      }}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMenuItem(item.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Categories</h2>
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setShowCategoryForm(true);
                }}
                className="bg-orange-500 hover:bg-orange-600 text-black font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Add New Category
              </button>
            </div>

            {/* Categories List */}
            <div className="space-y-4">
              {categories.sort((a, b) => a.order - b.order).map(category => (
                <div key={category.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-1">{category.name}</h3>
                      <p className="text-gray-400 mb-2">{category.description}</p>
                      <span className="text-gray-500 text-sm">Order: {category.order}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingCategory(category);
                          setShowCategoryForm(true);
                        }}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Item Form Modal */}
        {showItemForm && (
          <ItemFormModal
            item={editingItem}
            categories={categories}
            onSave={saveMenuItem}
            onClose={() => {
              setShowItemForm(false);
              setEditingItem(null);
            }}
          />
        )}

        {/* Category Form Modal */}
        {showCategoryForm && (
          <CategoryFormModal
            category={editingCategory}
            onSave={saveCategory}
            onClose={() => {
              setShowCategoryForm(false);
              setEditingCategory(null);
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
}

// Item Form Modal Component
function ItemFormModal({ 
  item, 
  categories, 
  onSave, 
  onClose 
}: { 
  item: MenuItem | null;
  categories: Category[];
  onSave: (item: MenuItem) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<MenuItem>({
    id: item?.id || '',
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || 0,
    category: item?.category || categories[0]?.id || '',
    image: item?.image || '',
    imageUrl: item?.imageUrl || '',
    available: item?.available ?? true,
    featured: item?.featured ?? false
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setFormData({ ...formData, image: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: '', imageUrl: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.description && formData.price > 0) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {item ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Item Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white h-20"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Image URL</label>
              <input
                type="url"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
              />
              <p className="text-gray-500 text-sm mt-1">Enter a direct URL to an image for this menu item</p>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Image Preview</label>
              {(formData.image || formData.imageUrl) ? (
                <div className="space-y-3">
                  <div className="relative">
                    <img
                      src={formData.image || formData.imageUrl}
                      alt="Menu item preview"
                      className="w-full h-40 object-cover rounded-lg border border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-replace"
                    />
                    <label
                      htmlFor="image-replace"
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-medium py-2 px-4 rounded-lg cursor-pointer text-center transition-colors"
                    >
                      Replace with Upload
                    </label>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-orange-500 transition-colors">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-400 mb-4">Upload an image or use the URL field above</p>
                  <p className="text-gray-500 text-sm mb-4">Supported formats: JPG, PNG, WebP (Max: 5MB)</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-block bg-orange-500 hover:bg-orange-600 text-black font-medium py-2 px-6 rounded-lg cursor-pointer transition-colors"
                  >
                    Upload Image
                  </label>
                </div>
              )}
            </div>
            
            <div className="flex space-x-4">
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="mr-2"
                />
                Available
              </label>
              
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="mr-2"
                />
                Featured
              </label>
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-medium py-2 rounded-lg transition-colors"
              >
                {item ? 'Update Item' : 'Add Item'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Category Form Modal Component
function CategoryFormModal({ 
  category, 
  onSave, 
  onClose 
}: { 
  category: Category | null;
  onSave: (category: Category) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<Category>({
    id: category?.id || '',
    name: category?.name || '',
    description: category?.description || '',
    order: category?.order || 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.description) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {category ? 'Edit Category' : 'Add New Category'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Category Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-300 mb-1">Display Order</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                required
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-black font-medium py-2 rounded-lg transition-colors"
              >
                {category ? 'Update Category' : 'Add Category'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
