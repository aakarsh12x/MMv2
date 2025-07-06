"use client";
import { useState, useEffect } from "react";
import { Trash2, Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateIncomes from "./CreateIncomes";

export default function IncomeList() {
  const [incomes, setIncomes] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await fetch('/api/incomes?createdBy=aakarshshrey12@gmail.com');
      if (response.ok) {
        const data = await response.json();
        setIncomes(data);
      }
    } catch (error) {
      console.error('Error fetching incomes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/incomes/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setIncomes(incomes.filter(income => income._id !== id));
      }
    } catch (error) {
      console.error('Error deleting income:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Income Sources</h2>
        <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Income
        </Button>
      </div>

      {incomes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500 mb-4">No income sources added yet.</p>
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Income
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {incomes.map((income) => (
            <Card key={income._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {income.source}
                    </h3>
                    <p className="text-gray-600 mb-2">{income.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Amount: ₹{income.amount}</span>
                      <span>Frequency: {income.frequency}</span>
                      <span>Date: {new Date(income.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(income._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            ))}
      </div>
      )}

      <CreateIncomes
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          fetchIncomes();
        }}
      />
    </div>
  );
}
