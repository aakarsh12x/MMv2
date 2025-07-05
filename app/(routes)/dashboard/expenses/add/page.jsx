"use client";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, PiggyBank, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function AddExpensePage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [loadingBudgets, setLoadingBudgets] = useState(true);
  const [budgetList, setBudgetList] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    budgetId: "",
    note: ""
  });

  useEffect(() => {
    if (user) {
      getBudgetList();
    }
  }, [user]);

  const getBudgetList = async () => {
    setLoadingBudgets(true);
    try {
      const response = await fetch(`/api/budgets?createdBy=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress || '')}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch budgets');
      }
      
      const result = await response.json();
      console.log("Budgets fetched:", result?.length || 0);
      setBudgetList(result || []);
      
      if (result?.length > 0) {
        setFormData(prev => ({...prev, budgetId: result[0]._id}));
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
      toast.error("Failed to load budgets. Please try again later.");
    } finally {
      setLoadingBudgets(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.amount || !formData.budgetId) {
      toast.error("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          amount: parseFloat(formData.amount),
          budgetId: formData.budgetId,
          createdBy: user?.primaryEmailAddress?.emailAddress || ''
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add expense');
      }

      const result = await response.json();

      if (result) {
        toast.success("Expense added successfully!");
        router.push("/dashboard/expenses");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const navigateToBudgets = () => {
    router.push("/dashboard/budgets");
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard/expenses" className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">Add New Expense</h1>
      </div>

      {loadingBudgets ? (
        <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-blue-100 rounded-full mb-4"></div>
            <div className="h-4 w-40 bg-gray-200 rounded mb-3"></div>
            <div className="h-3 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      ) : budgetList.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
            <PiggyBank size={28} />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Budgets Found</h2>
          <p className="text-gray-600 mb-6">
            You need to create at least one budget before adding expenses.
            Budgets help you categorize and track your expenses effectively.
          </p>
          <button
            onClick={navigateToBudgets}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} className="mr-1" />
            Create a Budget
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expense Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Groceries, Utilities, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount*
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Category*
                </label>
                <select
                  name="budgetId"
                  value={formData.budgetId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                >
                  <option value="" disabled>Select a budget</option>
                  {budgetList.map(budget => (
                    <option key={budget._id} value={budget._id}>
                      {budget.name} (₹{budget.amount})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note (Optional)
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Add details about this expense..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[100px]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Plus size={18} className="mr-2" />
                    Add Expense
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AddExpensePage; 