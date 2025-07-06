"use client";
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ExpenseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [expense, setExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchExpense();
    }
  }, [params.id]);

  const fetchExpense = async () => {
    try {
      const response = await fetch(`/api/expenses/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setExpense(data);
      } else {
        router.push('/dashboard/expenses');
      }
    } catch (error) {
      console.error('Error fetching expense:', error);
      router.push('/dashboard/expenses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const response = await fetch(`/api/expenses/${params.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        router.push('/dashboard/expenses');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Expense Not Found</h1>
          <Button onClick={() => router.push('/dashboard/expenses')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Expenses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/expenses')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Expense Details</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{expense.title}</CardTitle>
              <p className="text-gray-600 mt-1">
                {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Amount</h3>
              <p className="text-2xl font-bold text-green-600">
                ₹{expense.amount?.toLocaleString()}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Category</h3>
              <p className="text-gray-900 capitalize">{expense.category}</p>
            </div>

            {expense.budgetId && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-1">Budget</h3>
                <p className="text-gray-900">{expense.budgetName || 'Unknown Budget'}</p>
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Date</h3>
              <p className="text-gray-900">
                {new Date(expense.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {expense.description && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Description</h3>
              <p className="text-gray-900">{expense.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
