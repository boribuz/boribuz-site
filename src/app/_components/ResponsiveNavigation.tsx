"use client";

import Link from 'next/link';
import { useUnifiedAuth } from './UnifiedAuthContext';
import { useState } from 'react';

export default function ResponsiveNavigation() {
  const { user, logout } = useUnifiedAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-black shadow-lg sticky top-0 z-50 border-b border-orange-500/20" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-orange-500 p-2 rounded-lg">
                <span className="text-black font-bold text-lg">B</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-white">Boribuz</span>
                <div className="text-xs text-orange-300 hidden sm:block">Authentic Bangladeshi Cuisine</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              <Link 
                href="/" 
                className="text-white hover:text-orange-400 transition-colors duration-200 font-medium relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/menu" 
                className="text-white hover:text-orange-400 transition-colors duration-200 font-medium relative group"
              >
                Menu
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/order" 
                className="text-white hover:text-orange-400 transition-colors duration-200 font-medium relative group"
              >
                Order Online
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link 
                href="/about" 
                className="text-white hover:text-orange-400 transition-colors duration-200 font-medium relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            </div>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-white hover:text-orange-400 transition-colors duration-200 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 hover:border-orange-500">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-black font-semibold text-sm">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="font-medium">{user.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-black border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        My Orders
                      </Link>
                      {user.isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors border-t border-gray-700"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors border-t border-gray-700"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  href="/login" 
                  className="text-white hover:text-orange-400 transition-colors duration-200 font-medium px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-orange-500 hover:bg-orange-600 text-black font-semibold px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-orange-500/25 hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1 bg-gray-800 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors"
            aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className={`block w-5 h-0.5 bg-orange-500 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-orange-500 transition-opacity duration-200 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-5 h-0.5 bg-orange-500 transition-transform duration-200 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden bg-black border-t border-orange-500/20" role="navigation" aria-label="Mobile navigation menu">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  href="/" 
                  onClick={closeMobileMenu} 
                  className="text-white hover:text-orange-400 transition-colors py-2 border-b border-gray-800 hover:border-orange-500/30"
                >
                  Home
                </Link>
                <Link 
                  href="/menu" 
                  onClick={closeMobileMenu} 
                  className="text-white hover:text-orange-400 transition-colors py-2 border-b border-gray-800 hover:border-orange-500/30"
                >
                  Menu
                </Link>
                <Link 
                  href="/order" 
                  onClick={closeMobileMenu} 
                  className="text-white hover:text-orange-400 transition-colors py-2 border-b border-gray-800 hover:border-orange-500/30"
                >
                  Order Online
                </Link>
                <Link 
                  href="/about" 
                  onClick={closeMobileMenu} 
                  className="text-white hover:text-orange-400 transition-colors py-2 border-b border-gray-800 hover:border-orange-500/30"
                >
                  About
                </Link>
                
                {user ? (
                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-black font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <span className="text-orange-300 font-medium">{user.name}</span>
                    </div>
                    <div className="space-y-2">
                      <Link 
                        href="/profile" 
                        onClick={closeMobileMenu} 
                        className="flex items-center text-gray-300 hover:text-white transition-colors py-2"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        Profile
                      </Link>
                      <Link 
                        href="/orders" 
                        onClick={closeMobileMenu} 
                        className="flex items-center text-gray-300 hover:text-white transition-colors py-2"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        My Orders
                      </Link>
                      {user.isAdmin && (
                        <Link 
                          href="/admin/dashboard" 
                          onClick={closeMobileMenu} 
                          className="flex items-center text-gray-300 hover:text-white transition-colors py-2"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center text-gray-300 hover:text-white transition-colors py-2 w-full text-left"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-700 space-y-3">
                    <Link 
                      href="/login" 
                      onClick={closeMobileMenu} 
                      className="block text-white hover:text-orange-400 transition-colors py-2 px-4 rounded-lg hover:bg-gray-800 text-center"
                    >
                      Login
                    </Link>
                    <Link 
                      href="/register" 
                      onClick={closeMobileMenu} 
                      className="block bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-center shadow-lg"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
