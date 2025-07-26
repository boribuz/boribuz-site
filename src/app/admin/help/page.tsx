"use client";

import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useRequireAdminAuth } from '../../_components/UnifiedAuthContext';

interface GuideSection {
  id: string;
  title: string;
  description: string;
  steps: string[];
  tips?: string[];
}

const userGuide: GuideSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Welcome to your restaurant management system! This guide will help you manage your website easily.',
    steps: [
      'Access your admin panel by logging in at yourwebsite.com/admin',
      'Use the sidebar menu to navigate between different sections',
      'Make changes to any section and click "Save Changes" to apply them',
      'Preview your website anytime by clicking "View Website" in the sidebar',
      'All changes are saved automatically to your browser, but will be permanent once integrated with your server'
    ],
    tips: [
      'Always preview your changes on the actual website before customers see them',
      'Keep your login information secure and don\'t share it with unauthorized people',
      'Make small changes one at a time and test them before making more changes'
    ]
  },
  {
    id: 'content-management',
    title: 'Managing Website Content',
    description: 'Learn how to update text and content on your website pages.',
    steps: [
      'Go to "Website Content" in the sidebar menu',
      'Choose which page you want to edit (Homepage, About, or Menu)',
      'Click in any text box to edit the content',
      'Use simple formatting like bold, italic, or bullet points if needed',
      'Click "Save Changes" when you\'re done editing',
      'Check the "Live Preview" to see how your changes will look'
    ],
    tips: [
      'Write in a friendly, welcoming tone that represents your restaurant',
      'Keep descriptions clear and appetizing for food items',
      'Update your content regularly to keep customers engaged',
      'Mention any special dietary options (vegetarian, gluten-free, etc.)'
    ]
  },
  {
    id: 'menu-management',
    title: 'Managing Your Menu',
    description: 'Add, edit, and organize your food items and categories.',
    steps: [
      'Navigate to "Menu Management" from the sidebar',
      'To add a new menu item, click "Add New Item"',
      'Fill in the item name, description, price, and category',
      'Choose if the item is available and if it should be featured',
      'To edit existing items, click "Edit" on any menu item card',
      'Create new categories by switching to the "Categories" tab',
      'Organize categories by setting their display order'
    ],
    tips: [
      'Write mouth-watering descriptions that highlight key ingredients',
      'Set items as "Featured" to highlight your best dishes',
      'Mark items as "Unavailable" instead of deleting them when temporarily out of stock',
      'Group similar items together in logical categories',
      'Keep prices up-to-date and accurate'
    ]
  },
  {
    id: 'restaurant-info',
    title: 'Managing Restaurant Information',
    description: 'Update your contact details, hours, and business information.',
    steps: [
      'Access "Restaurant Info" from the sidebar',
      'Update your basic information like name and description',
      'Enter your complete address for accurate location services',
      'Add phone number, email, and website information',
      'Set your operating hours for each day of the week',
      'Add social media links to connect with customers',
      'Configure delivery areas and policies'
    ],
    tips: [
      'Double-check your phone number and address for accuracy',
      'Keep your hours up-to-date, especially during holidays',
      'Add social media links to grow your online presence',
      'Be specific about delivery areas to avoid confusion',
      'Update contact information immediately if it changes'
    ]
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting Common Issues',
    description: 'Solutions to common problems you might encounter.',
    steps: [
      'If changes don\'t appear, try refreshing your browser',
      'Clear your browser cache if the website looks outdated',
      'If images don\'t load, check the file size and format',
      'If you can\'t save changes, check your internet connection',
      'For urgent issues, contact your web developer',
      'Always keep a backup of important information'
    ],
    tips: [
      'Most issues can be fixed by refreshing the page',
      'Take screenshots of any error messages to help with support',
      'Test your website on different devices and browsers',
      'Keep your admin login information secure',
      'Don\'t panic - most issues are easily fixable'
    ]
  }
];

export default function HelpPage() {
  const { user, isLoading, hasAccess, shouldRedirect } = useRequireAdminAuth();
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredGuide = userGuide.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.steps.some(step => step.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentSection = userGuide.find(section => section.id === activeSection);

  return (
    <AdminLayout>
      <div className="p-6 bg-black min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">User Guide & Help</h1>
          <p className="text-gray-400">Complete guide to managing your restaurant website</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search help topics..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-4 sticky top-6">
              <h3 className="text-white font-semibold mb-4">Help Topics</h3>
              <nav className="space-y-2">
                {filteredGuide.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                      activeSection === section.id
                        ? 'bg-orange-500 text-black'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <div className="font-medium text-sm">{section.title}</div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {currentSection && (
              <div className="bg-gray-900 rounded-lg p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-3">{currentSection.title}</h2>
                  <p className="text-gray-300 text-lg">{currentSection.description}</p>
                </div>

                {/* Steps */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Step-by-Step Instructions</h3>
                  <div className="space-y-4">
                    {currentSection.steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-black rounded-full flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <p className="text-gray-300 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                {currentSection.tips && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6">
                    <h4 className="text-orange-400 font-semibold mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Pro Tips
                    </h4>
                    <ul className="space-y-2">
                      {currentSection.tips.map((tip, index) => (
                        <li key={index} className="text-gray-300 flex items-start">
                          <span className="text-orange-400 mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/content"
              className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition-colors group"
            >
              <svg className="w-8 h-8 text-orange-500 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <h4 className="text-white font-medium mb-1">Edit Content</h4>
              <p className="text-gray-400 text-sm">Update website text</p>
            </a>

            <a
              href="/admin/menu"
              className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition-colors group"
            >
              <svg className="w-8 h-8 text-orange-500 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h4 className="text-white font-medium mb-1">Manage Menu</h4>
              <p className="text-gray-400 text-sm">Add or edit food items</p>
            </a>

            <a
              href="/admin/restaurant"
              className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition-colors group"
            >
              <svg className="w-8 h-8 text-orange-500 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-white font-medium mb-1">Restaurant Info</h4>
              <p className="text-gray-400 text-sm">Update contact & ordering links</p>
            </a>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg transition-colors group"
            >
              <svg className="w-8 h-8 text-orange-500 mb-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <h4 className="text-white font-medium mb-1">View Website</h4>
              <p className="text-gray-400 text-sm">See your live website</p>
            </a>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8 bg-orange-500/10 border border-orange-500/20 rounded-lg p-6">
          <h3 className="text-orange-400 font-semibold mb-3">Need More Help?</h3>
          <p className="text-gray-300 mb-4">
            If you can&apos;t find what you&apos;re looking for in this guide, don&apos;t hesitate to reach out for support.
          </p>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="text-gray-300">
              <strong>Email:</strong> support@yourwebsite.com
            </div>
            <div className="text-gray-300">
              <strong>Phone:</strong> (555) 123-4567
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
