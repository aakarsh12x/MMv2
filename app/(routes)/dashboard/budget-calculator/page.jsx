"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Calculator, Plus, Minus, Save, Download, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

function BudgetCalculatorPage() {
  const { user } = useUser();
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [budgetCategories, setBudgetCategories] = useState([
    { name: 'Housing', percentage: 30, amount: 0, color: 'bg-blue-500' },
    { name: 'Transportation', percentage: 10, amount: 0, color: 'bg-green-500' },
    { name: 'Food & Dining', percentage: 15, amount: 0, color: 'bg-yellow-500' },
    { name: 'Utilities', percentage: 5, amount: 0, color: 'bg-purple-500' },
    { name: 'Healthcare', percentage: 5, amount: 0, color: 'bg-red-500' },
    { name: 'Entertainment', percentage: 5, amount: 0, color: 'bg-pink-500' },
    { name: 'Shopping', percentage: 5, amount: 0, color: 'bg-indigo-500' },
    { name: 'Savings', percentage: 20, amount: 0, color: 'bg-emerald-500' },
    { name: 'Emergency Fund', percentage: 5, amount: 0, color: 'bg-orange-500' }
  ]);
  const [customCategories, setCustomCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', percentage: 0 });

  useEffect(() => {
    calculateBudget();
  }, [monthlyIncome, budgetCategories, customCategories]);

  const calculateBudget = () => {
    const income = parseFloat(monthlyIncome) || 0;
    
    const updatedCategories = budgetCategories.map(category => ({
      ...category,
      amount: (income * category.percentage) / 100
    }));
    
    const updatedCustomCategories = customCategories.map(category => ({
      ...category,
      amount: (income * category.percentage) / 100
    }));
    
    setBudgetCategories(updatedCategories);
    setCustomCategories(updatedCustomCategories);
  };

  const addCustomCategory = () => {
    if (!newCategory.name || newCategory.percentage <= 0) {
      toast.error('Please enter a valid category name and percentage');
      return;
    }

    const totalPercentage = [...budgetCategories, ...customCategories].reduce((sum, cat) => sum + cat.percentage, 0) + newCategory.percentage;
    
    if (totalPercentage > 100) {
      toast.error('Total percentage cannot exceed 100%');
      return;
    }

    setCustomCategories([...customCategories, {
      ...newCategory,
      color: `bg-${['blue', 'green', 'yellow', 'purple', 'red', 'pink', 'indigo', 'emerald', 'orange'][Math.floor(Math.random() * 9)]}-500`
    }]);
    setNewCategory({ name: '', percentage: 0 });
    setShowAddCategory(false);
  };

  const removeCustomCategory = (index) => {
    setCustomCategories(customCategories.filter((_, i) => i !== index));
  };

  const updateCategoryPercentage = (index, newPercentage, isCustom = false) => {
    const categories = isCustom ? customCategories : budgetCategories;
    const setCategories = isCustom ? setCustomCategories : setBudgetCategories;
    
    const updatedCategories = [...categories];
    updatedCategories[index] = { ...updatedCategories[index], percentage: newPercentage };
    setCategories(updatedCategories);
  };

  const saveBudgetPlan = async () => {
    if (!monthlyIncome) {
      toast.error('Please enter your monthly income');
      return;
    }

    try {
      const allCategories = [...budgetCategories, ...customCategories];
      
      // Save each category as a budget
      for (const category of allCategories) {
        if (category.percentage > 0) {
          await fetch('/api/budgets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: category.name,
              amount: category.amount.toFixed(2),
              icon: '💰',
              createdBy: user?.primaryEmailAddress?.emailAddress || ''
            })
          });
        }
      }
      
      toast.success('Budget plan saved successfully!');
    } catch (error) {
      console.error('Error saving budget plan:', error);
      toast.error('Failed to save budget plan');
    }
  };

  const exportBudgetPlan = () => {
    const plan = {
      monthlyIncome: parseFloat(monthlyIncome),
      categories: [...budgetCategories, ...customCategories],
      totalAllocated: [...budgetCategories, ...customCategories].reduce((sum, cat) => sum + cat.percentage, 0),
      remaining: 100 - [...budgetCategories, ...customCategories].reduce((sum, cat) => sum + cat.percentage, 0)
    };

    const dataStr = JSON.stringify(plan, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `budget_plan_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Budget plan exported successfully!');
  };

  const totalAllocated = [...budgetCategories, ...customCategories].reduce((sum, cat) => sum + cat.percentage, 0);
  const remaining = 100 - totalAllocated;

  return (
    <div className="p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Budget Calculator</h1>
        <p className="text-gray-600">Plan your monthly budget using the 50/30/20 rule or customize your own allocation</p>
      </div>

      {/* Income Input */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Monthly Income</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your monthly income
            </label>
            <Input
              type="number"
              placeholder="₹50,000"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(e.target.value)}
              className="text-lg"
            />
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Budget</p>
            <p className="text-2xl font-bold text-gray-900">₹{parseFloat(monthlyIncome || 0).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Standard Categories */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Standard Budget Categories</h2>
          <div className="space-y-4">
            {budgetCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={category.percentage}
                    onChange={(e) => updateCategoryPercentage(index, parseFloat(e.target.value) || 0)}
                    className="w-20 text-center"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-gray-500">%</span>
                  <span className="text-sm font-medium">₹{category.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Categories */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Custom Categories</h2>
            <Button
              onClick={() => setShowAddCategory(true)}
              size="sm"
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              Add Category
            </Button>
          </div>
          
          <div className="space-y-4">
            {customCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={category.percentage}
                    onChange={(e) => updateCategoryPercentage(index, parseFloat(e.target.value) || 0, true)}
                    className="w-20 text-center"
                    min="0"
                    max="100"
                  />
                  <span className="text-sm text-gray-500">%</span>
                  <span className="text-sm font-medium">₹{category.amount.toLocaleString()}</span>
                  <Button
                    onClick={() => removeCustomCategory(index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Minus size={16} />
                  </Button>
                </div>
              </div>
            ))}
            
            {customCategories.length === 0 && (
              <p className="text-gray-500 text-center py-4">No custom categories added yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add Custom Category</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Gym Membership"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Percentage (%)
                </label>
                <Input
                  type="number"
                  placeholder="5"
                  value={newCategory.percentage}
                  onChange={(e) => setNewCategory({ ...newCategory, percentage: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max="100"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={() => setShowAddCategory(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={addCustomCategory} className="flex-1">
                Add Category
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Budget Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total Allocated</p>
            <p className="text-2xl font-bold text-blue-600">{totalAllocated.toFixed(1)}%</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Remaining</p>
            <p className="text-2xl font-bold text-green-600">{remaining.toFixed(1)}%</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Calculator className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Total Budget</p>
            <p className="text-2xl font-bold text-purple-600">₹{parseFloat(monthlyIncome || 0).toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <TrendingDown className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Categories</p>
            <p className="text-2xl font-bold text-orange-600">{budgetCategories.length + customCategories.length}</p>
          </div>
        </div>
        
        {remaining < 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">⚠️ Warning: Your allocation exceeds 100% by {Math.abs(remaining).toFixed(1)}%</p>
          </div>
        )}
        
        {remaining > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700">💡 Tip: You have {remaining.toFixed(1)}% unallocated. Consider adding more categories or increasing existing allocations.</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-8">
        <Button
          onClick={saveBudgetPlan}
          disabled={!monthlyIncome || totalAllocated <= 0}
          className="flex items-center gap-2"
        >
          <Save size={18} />
          Save Budget Plan
        </Button>
        <Button
          onClick={exportBudgetPlan}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download size={18} />
          Export Plan
        </Button>
      </div>
    </div>
  );
}

export default BudgetCalculatorPage; 