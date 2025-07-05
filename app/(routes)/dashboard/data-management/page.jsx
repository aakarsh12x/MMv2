"use client";
import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Download, Upload, FileText, FileSpreadsheet, FileJson, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

function DataManagementPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [data, setData] = useState({
    budgets: [],
    expenses: [],
    incomes: []
  });

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [budgetsRes, expensesRes, incomesRes] = await Promise.all([
        fetch(`/api/budgets?createdBy=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress || '')}`),
        fetch(`/api/expenses?createdBy=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress || '')}`),
        fetch(`/api/incomes?createdBy=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress || '')}`)
      ]);

      const budgets = await budgetsRes.json();
      const expenses = await expensesRes.json();
      const incomes = await incomesRes.json();

      setData({ budgets, expenses, incomes });
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    try {
      // Create CSV content
      let csvContent = 'data:text/csv;charset=utf-8,';
      
      // Add headers
      csvContent += 'Type,Name,Amount,Category,Created Date\n';
      
      // Add budgets
      data.budgets.forEach(budget => {
        csvContent += `Budget,${budget.name},${budget.amount},${budget.icon},${new Date(budget.createdAt).toLocaleDateString()}\n`;
      });
      
      // Add expenses
      data.expenses.forEach(expense => {
        csvContent += `Expense,${expense.name},${expense.amount},${expense.budgetId || 'Uncategorized'},${new Date(expense.createdAt).toLocaleDateString()}\n`;
      });
      
      // Add incomes
      data.incomes.forEach(income => {
        csvContent += `Income,${income.name},${income.amount},${income.icon},${new Date(income.createdAt).toLocaleDateString()}\n`;
      });
      
      // Download file
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `moneymap_data_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Data exported to CSV successfully!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV');
    }
  };

  const exportToJSON = async () => {
    try {
      const response = await fetch(`/api/data/export?createdBy=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress || '')}`);
      
      if (!response.ok) {
        throw new Error('Failed to export data');
      }
      
      const exportData = await response.json();
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `moneymap_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Data exported to JSON successfully!');
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast.error('Failed to export JSON');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImportLoading(true);
    try {
      const text = await file.text();
      let importData;

      if (file.name.endsWith('.json')) {
        importData = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        importData = parseCSV(text);
      } else {
        throw new Error('Unsupported file format');
      }

      // Import the data
      await importData(importData);
      toast.success('Data imported successfully!');
      fetchAllData(); // Refresh data
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error('Failed to import data. Please check file format.');
    } finally {
      setImportLoading(false);
    }
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',');
        const row = {};
        headers.forEach((header, index) => {
          row[header.trim()] = values[index]?.trim() || '';
        });
        data.push(row);
      }
    }
    
    return data;
  };

  const importData = async (importData) => {
    const userEmail = user?.primaryEmailAddress?.emailAddress || '';

    // Handle JSON import
    if (importData.data) {
      const { budgets, expenses, incomes } = importData.data;
      
      // Use bulk import API
      const response = await fetch('/api/data/bulk-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budgets: budgets || [],
          expenses: expenses || [],
          incomes: incomes || [],
          createdBy: userEmail
        })
      });

      if (!response.ok) {
        throw new Error('Failed to import data');
      }

      const result = await response.json();
      console.log('Import result:', result);
    }
  };

  const clearAllData = async () => {
    try {
      // Delete all budgets, expenses, and incomes for the user
      const userEmail = user?.primaryEmailAddress?.emailAddress || '';
      
      // Get all data first
      const [budgetsRes, expensesRes, incomesRes] = await Promise.all([
        fetch(`/api/budgets?createdBy=${encodeURIComponent(userEmail)}`),
        fetch(`/api/expenses?createdBy=${encodeURIComponent(userEmail)}`),
        fetch(`/api/incomes?createdBy=${encodeURIComponent(userEmail)}`)
      ]);

      const budgets = await budgetsRes.json();
      const expenses = await expensesRes.json();
      const incomes = await incomesRes.json();

      // Delete all items
      await Promise.all([
        ...budgets.map(budget => 
          fetch(`/api/budgets/${budget._id}`, { method: 'DELETE' })
        ),
        ...expenses.map(expense => 
          fetch(`/api/expenses/${expense._id}`, { method: 'DELETE' })
        ),
        ...incomes.map(income => 
          fetch(`/api/incomes/${income._id}`, { method: 'DELETE' })
        )
      ]);

      toast.success('All data cleared successfully!');
      fetchAllData();
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Failed to clear data');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Management</h1>
        <p className="text-gray-600">Export and import your financial data</p>
      </div>

      {/* Data Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Budgets</p>
              <p className="text-2xl font-bold text-gray-900">{data.budgets.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{data.expenses.length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <FileSpreadsheet className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Incomes</p>
              <p className="text-2xl font-bold text-gray-900">{data.incomes.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FileJson className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Export Data</h2>
        <p className="text-gray-600 mb-6">Download your financial data in various formats</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={exportToCSV}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Export as CSV
          </Button>
          
          <Button
            onClick={exportToJSON}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <FileJson className="h-4 w-4" />
            Export as JSON
          </Button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Import Data</h2>
        <p className="text-gray-600 mb-6">Import your financial data from CSV or JSON files</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File (CSV or JSON)
            </label>
            <input
              type="file"
              accept=".csv,.json"
              onChange={handleFileUpload}
              disabled={importLoading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          
          {importLoading && (
            <div className="flex items-center gap-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Importing data...</span>
            </div>
          )}
        </div>
      </div>

      {/* Clear Data Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
        <p className="text-gray-600 mb-6">Permanently delete all your financial data</p>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Clear All Data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all your budgets, expenses, and incomes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={clearAllData} className="bg-red-600 hover:bg-red-700">
                Yes, clear all data
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default DataManagementPage; 