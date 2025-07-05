"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../_components/AddExpense";
import ExpenseListTable from "../_components/ExpenseListTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pen, PenBox, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import EditBudget from "../_components/EditBudget";
import Link from 'next/link';

function ExpensesScreen({ params }) {
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [expensesList, setExpensesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getBudgetAndExpenses();
    }
  }, [user, params.id]);

  const getBudgetAndExpenses = async () => {
    try {
      // Get all budgets for the user
      const budgetResponse = await fetch(`/api/budgets?createdBy=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress || '')}`);
      if (!budgetResponse.ok) throw new Error('Failed to fetch budgets');
      const budgets = await budgetResponse.json();
      
      // Find the specific budget
      const budget = budgets.find(b => b._id === params.id);
      
      if (budget) {
        // Get expenses for the current user
        const expenseResponse = await fetch(`/api/expenses?createdBy=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress || '')}`);
        if (!expenseResponse.ok) throw new Error('Failed to fetch expenses');
        const allExpenses = await expenseResponse.json();
        
        // Filter expenses for this budget
        const expenses = allExpenses.filter(expense => expense.budgetId === params.id);
        
        // Calculate totals
        const totalSpend = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
        const totalItem = expenses.length;
        
        const budgetWithTotals = {
          ...budget,
          totalSpend,
          totalItem
        };
        
        setBudgetInfo(budgetWithTotals);
        setExpensesList(expenses);
      }
    } catch (error) {
      console.error("Error fetching budget and expenses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
  return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/dashboard/budgets">
            <ArrowLeft className="text-gray-600 hover:text-gray-900 cursor-pointer" size={24} />
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">My Expenses</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard/budgets">
          <ArrowLeft className="text-gray-600 hover:text-gray-900 cursor-pointer" size={24} />
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">My Expenses</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
          </div>
        )}
        <AddExpense budgetId={params.id} />
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-bold">Latest Expenses</h3>
          {budgetInfo && <EditBudget budgetInfo={budgetInfo} />}
        </div>
        <ExpenseListTable
          expensesList={expensesList}
          refreshData={getBudgetAndExpenses} 
        />
      </div>
    </div>
  );
}

export default ExpensesScreen;
