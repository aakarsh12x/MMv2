"use client";
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, Calendar, Filter, PieChart as PieChartIcon } from 'lucide-react';

function SpendingAnalytics({ budgetList = [] }) {
  // Calculate spending by category
  const categorySpending = budgetList.reduce((acc, budget) => {
    if (budget.totalSpend && budget.totalSpend > 0) {
      acc.push({
        name: budget.name,
        value: budget.totalSpend,
        budget: budget.amount,
        utilization: (budget.totalSpend / budget.amount) * 100
      });
    }
    return acc;
  }, []);

  const totalSpent = categorySpending.reduce((sum, cat) => sum + cat.value, 0);

  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-blue-600">Spent: ₹{data.value.toLocaleString()}</p>
          <p className="text-gray-600">Budget: ₹{data.budget.toLocaleString()}</p>
          <p className={`text-sm ${
            data.utilization > 100 ? 'text-red-600' : 
            data.utilization > 80 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {data.utilization.toFixed(0)}% used
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <PieChartIcon className="text-blue-600" size={20} />
          <h3 className="text-lg font-bold text-gray-900">Spending Analytics</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Calendar size={16} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Filter size={16} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {categorySpending.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-500 mb-1">No spending data yet</p>
            <p className="text-gray-400 text-sm">Add some expenses to see your spending breakdown</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categorySpending}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categorySpending.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category List */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 mb-4">Category Breakdown</h4>
              {categorySpending.map((cat, index) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-900">{cat.name}</p>
                      <p className="text-sm text-gray-500">
                        ₹{cat.value.toLocaleString()} of ₹{cat.budget.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {((cat.value / totalSpent) * 100).toFixed(1)}%
                    </div>
                    <div className={`text-xs ${
                      cat.utilization > 100 ? 'text-red-600' : 
                      cat.utilization > 80 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {cat.utilization.toFixed(0)}% used
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {categorySpending.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {categorySpending.length} active categories
            </span>
            <div className="flex items-center text-green-600">
              <TrendingUp size={14} className="mr-1" />
              <span>Spending insights available</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpendingAnalytics; 