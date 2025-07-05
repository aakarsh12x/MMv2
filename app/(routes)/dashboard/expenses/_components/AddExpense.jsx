"use client";
import React, { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

function AddExpense({ budgetId, refreshData }) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    note: ""
  });
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

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

    if (!formData.name || !formData.amount) {
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
          budgetId: budgetId,
          createdBy: user?.primaryEmailAddress?.emailAddress || ''
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add expense');
      }

      const result = await response.json();

      if (result) {
        toast.success("Expense added successfully!");
        setFormData({ name: "", amount: "", note: "" });
        if (refreshData) {
          refreshData();
        }
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Add New Expense</h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expense Name*
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Groceries, Utilities"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount*
            </label>
        <Input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
        />
      </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note (Optional)
            </label>
        <Input
              type="text"
              name="note"
              value={formData.note}
              onChange={handleChange}
              placeholder="Add details about this expense..."
        />
      </div>

      <Button
            type="submit"
            disabled={loading}
            className="w-full"
      >
            {loading ? (
              "Adding..."
            ) : (
              <>
                <Plus size={16} className="mr-2" />
                Add Expense
              </>
            )}
      </Button>
        </div>
      </form>
    </div>
  );
}

export default AddExpense;
