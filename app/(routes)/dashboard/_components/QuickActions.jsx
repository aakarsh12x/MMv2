"use client";
import React from 'react';
import { Plus, Target, DollarSign, BarChart3, Calculator, Download, Upload, Settings } from 'lucide-react';
import Link from 'next/link';

function QuickActions() {
  const actions = [
    {
      title: "Add Expense",
      description: "Record a new expense",
      href: "/dashboard/expenses/add",
      icon: Plus,
      color: "bg-blue-600 hover:bg-blue-700",
      textColor: "text-white"
    },
    {
      title: "Create Budget",
      description: "Set up a new budget category",
      href: "/dashboard/budgets",
      icon: Target,
      color: "bg-green-600 hover:bg-green-700",
      textColor: "text-white"
    },
    {
      title: "Add Income",
      description: "Record income source",
      href: "/dashboard/incomes",
      icon: BarChart3,
      color: "bg-purple-600 hover:bg-purple-700",
      textColor: "text-white"
    },
    {
      title: "Budget Calculator",
      description: "Plan your monthly budget",
      href: "/dashboard/budget-calculator",
      icon: Calculator,
      color: "bg-white hover:bg-gray-50 border border-gray-200",
      textColor: "text-gray-700"
    },
    {
      title: "Export Data",
      description: "Download your financial data",
      href: "/dashboard/data-management",
      icon: Download,
      color: "bg-white hover:bg-gray-50 border border-gray-200",
      textColor: "text-gray-700"
    },
    {
      title: "Import Data",
      description: "Upload transactions from CSV",
      href: "/dashboard/data-management",
      icon: Upload,
      color: "bg-white hover:bg-gray-50 border border-gray-200",
      textColor: "text-gray-700"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Settings className="text-blue-600" size={20} />
          <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">Manage your finances with one click</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                href={action.href}
                className={`p-4 rounded-lg transition-all duration-200 transform hover:scale-105 ${action.color} group`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={`p-2 rounded-lg ${action.textColor}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 className={`font-semibold text-sm ${action.textColor}`}>
                      {action.title}
                    </h4>
                    <p className={`text-xs ${action.textColor} opacity-80`}>
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Need help getting started?</span>
          <Link 
            href="#" 
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View Guide
          </Link>
        </div>
      </div>
    </div>
  );
}

export default QuickActions; 