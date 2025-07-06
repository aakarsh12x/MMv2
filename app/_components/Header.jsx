"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Search, 
  Bell, 
  Plus, 
  Menu, 
  X, 
  Home, 
  BarChart3, 
  Target, 
  DollarSign,
  Settings,
  HelpCircle
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Budgets', href: '/dashboard/budgets', icon: Target },
    { name: 'Expenses', href: '/dashboard/expenses', icon: DollarSign },
    { name: 'Income', href: '/dashboard/incomes', icon: BarChart3 },
  ];

  const quickActions = [
    { name: 'Add Expense', href: '/dashboard/expenses/add', color: 'bg-blue-600' },
    { name: 'Create Budget', href: '/dashboard/budgets', color: 'bg-green-600' },
    { name: 'Add Income', href: '/dashboard/incomes', color: 'bg-purple-600' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 min-w-[180px]">
            <Link href="/" className="flex items-center space-x-2">
              {/* Simple text-based logo that always works */}
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg text-white font-bold text-sm shadow-sm">
                MM
              </div>
              <span className="text-2xl font-bold text-blue-700 tracking-tight select-none">MoneyMap</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search size={20} />
            </button>

            {/* Quick Add Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus size={18} />
                <span className="hidden sm:block text-sm font-medium">Add</span>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  {quickActions.map((action) => (
                    <Link
                      key={action.name}
                      href={action.href}
                      className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <div className={`w-2 h-2 rounded-full ${action.color}`}></div>
                      <span className="text-sm">{action.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Notifications */}
            <NotificationDropdown />

            {/* Settings (Desktop only) */}
            <Link 
              href="/dashboard/settings" 
              className="hidden md:block p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings size={20} />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar (when opened) */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search transactions, budgets, or expenses..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="space-y-4">
              {/* Mobile Navigation */}
              <div className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Quick Actions */}
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Quick Actions</p>
                <div className="space-y-2">
                  {quickActions.map((action) => (
                    <Link
                      key={action.name}
                      href={action.href}
                      className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className={`w-2 h-2 rounded-full ${action.color}`}></div>
                      <span>{action.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
        </div>
      )}
    </div>
    </header>
  );
}

export default Header;
