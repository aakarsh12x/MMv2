"use client";
import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, MoreHorizontal, Filter } from 'lucide-react';
import Link from 'next/link';

function RecentTransactions({ expensesList = [], incomeList = [] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Combine and sort transactions by date
  const allTransactions = [
    ...(expensesList || []).map(expense => ({
      id: expense._id || expense.id,
      type: 'expense',
      name: expense.name,
      amount: expense.amount,
      createdAt: expense.createdAt,
      category: expense.budgetId?.name || 'Other',
    })),
    ...(incomeList || []).map(income => ({
      id: income._id || income.id,
      type: 'income',
      name: income.name,
      amount: income.amount,
      createdAt: income.createdAt,
      category: 'Income',
    }))
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
   .slice(0, 8); // Show only 8 most recent

  const formatDate = (dateString) => {
    if (!mounted) return 'Loading...';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const getCategoryIcon = (category, type) => {
    const iconMap = {
      'Food': '🍽️',
      'Transportation': '🚗',
      'Shopping': '🛍️',
      'Entertainment': '🎭',
      'Bills': '📄',
      'Healthcare': '🏥',
      'Education': '📚',
      'Travel': '✈️',
      'Income': '💰',
      'Car': '🚗',
      'Other': '📌'
    };
    return iconMap[category] || (type === 'income' ? '💰' : '💸');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Clock className="text-blue-600" size={20} />
          <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Filter size={16} />
          </button>
          <Link 
            href="/dashboard/expenses" 
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </Link>
        </div>
      </div>

      <div className="p-6">
        {allTransactions.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-500 mb-1">No transactions yet</p>
            <p className="text-gray-400 text-sm">Start adding expenses and income to see your activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allTransactions.map((transaction) => (
              <div key={`${transaction.type}-${transaction.id}`} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'income' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    <span className="text-lg">
                      {getCategoryIcon(transaction.category, transaction.type)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{formatDate(transaction.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className={`font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount?.toLocaleString()}
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      {transaction.type === 'income' ? (
                        <ArrowUpRight size={12} className="mr-1" />
                      ) : (
                        <ArrowDownRight size={12} className="mr-1" />
                      )}
                      {transaction.type === 'income' ? 'Credit' : 'Debit'}
                    </div>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {allTransactions.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Showing {allTransactions.length} recent transactions
            </span>
            <Link 
              href="/dashboard/expenses" 
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View all transactions
              <ArrowUpRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecentTransactions; 