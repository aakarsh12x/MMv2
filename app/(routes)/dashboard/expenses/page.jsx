"use client"
import React, { useEffect, useState } from 'react'
import ExpenseListTable from './_components/ExpenseListTable';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import Link from 'next/link';
import { Plus } from 'lucide-react';

function ExpensesScreen() {
  const [expensesList, setExpensesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    count: 0,
    average: 0
  });
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getAllExpenses();
    }
  }, [user]);

  /**
   * Used to get All expenses belong to users
   */
  const getAllExpenses = async () => {
    setLoading(true);
    try {
      // Get expenses for the current user
      const response = await fetch(`/api/expenses?createdBy=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress || '')}`);
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const result = await response.json();
      
      setExpensesList(result);
      
      // Calculate stats
      if (result.length > 0) {
        const total = result.reduce((sum, expense) => {
          // Convert expense amount to number if it's not already
          const amount = typeof expense.amount === 'number' 
            ? expense.amount 
            : parseFloat(expense.amount || 0);
          return sum + amount;
        }, 0);
        
        setStats({
          total: Number(total || 0),
          count: result.length,
          average: Number(total / result.length || 0)
        });
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-6'>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className='font-bold text-2xl md:text-3xl text-gray-800'>My Expenses</h1>
        
        <Link href="/dashboard/expenses/add" className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-sm transition-colors">
          <Plus size={18} />
          <span>Add New</span>
        </Link>
      </div>

      {/* Stats cards */}
      {!loading && expensesList.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-500 mb-1">Total Spent</p>
            <h3 className="text-2xl font-bold text-gray-800">₹{(stats.total || 0).toFixed(2)}</h3>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-500 mb-1">Number of Expenses</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.count}</h3>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-500 mb-1">Average Expense</p>
            <h3 className="text-2xl font-bold text-gray-800">₹{(stats.average || 0).toFixed(2)}</h3>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-4">
          <div className="h-10 w-40 bg-gray-200 rounded-md animate-pulse mb-4"></div>
          <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      ) : (
        <ExpenseListTable 
          refreshData={getAllExpenses}
          expensesList={expensesList}
        />
      )}
    </div>
  )
}

export default ExpensesScreen