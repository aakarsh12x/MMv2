import { Edit, Trash } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
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

function ExpenseListTable({ expensesList, refreshData }) {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format amount as currency, ensuring it's a number
  const formatAmount = (amount) => {
    // Convert to number if it's not already
    const numAmount = typeof amount === 'number' 
      ? amount 
      : parseFloat(amount || 0);
    
    // Handle NaN
    if (isNaN(numAmount)) return '0.00';
    
    // Format with 2 decimal places
    return numAmount.toFixed(2);
  };

  const confirmDelete = (expense) => {
    setExpenseToDelete(expense);
  };

  const deleteExpense = async () => {
    if (!expenseToDelete) return;
    
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/expenses/${expenseToDelete._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      toast.success("Expense deleted successfully");
      refreshData();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    } finally {
      setDeleteLoading(false);
      setExpenseToDelete(null);
    }
  };

  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
      <h2 className="font-bold text-xl p-4 border-b">Latest Expenses</h2>
      
      {/* Header - hidden on mobile */}
      <div className="hidden md:grid md:grid-cols-4 p-4 font-medium text-gray-600 bg-gray-50">
        <h3>Name</h3>
        <h3>Amount</h3>
        <h3>Date</h3>
        <h3 className="text-right">Actions</h3>
      </div>
      
      {/* Empty state */}
      {expensesList.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-500 mb-4">No expenses found</p>
          <Link 
            href="/dashboard/expenses/add" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Expense
          </Link>
        </div>
      )}
      
      {/* Expense list */}
      <div className="divide-y">
        {expensesList.map((expense) => (
          <div 
            key={expense._id} 
            className="grid grid-cols-1 md:grid-cols-4 p-4 hover:bg-gray-50 transition-colors gap-2 md:gap-0"
          >
            {/* Mobile view - card style */}
            <div className="md:hidden flex justify-between mb-2">
              <h3 className="font-medium">{expense.name}</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => confirmDelete(expense)}
                  className="p-1.5 bg-red-50 text-red-600 rounded-full hover:bg-red-100"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
            <div className="md:hidden grid grid-cols-2 text-sm text-gray-600">
              <span>Amount:</span>
              <span className="font-medium">₹{formatAmount(expense.amount)}</span>
              <span>Date:</span>
              <span>{formatDate(expense.createdAt)}</span>
            </div>
            
            {/* Desktop view - table style */}
            <h3 className="hidden md:block font-medium">{expense.name}</h3>
            <div className="hidden md:block text-gray-800">₹{formatAmount(expense.amount)}</div>
            <div className="hidden md:block text-gray-600">{formatDate(expense.createdAt)}</div>
            <div className="hidden md:flex justify-end gap-2">
              <button
                onClick={() => confirmDelete(expense)}
                className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!expenseToDelete} onOpenChange={open => !open && setExpenseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the expense "{expenseToDelete?.name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteExpense}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ExpenseListTable;
