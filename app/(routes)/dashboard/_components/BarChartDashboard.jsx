import React from "react";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function BarChartDashboard({ budgetList, expensesList = [] }) {
  // Ensure data is properly formatted for the chart
  const formattedData = budgetList?.map(budget => {
    // Convert string amounts to numbers and handle null/undefined values
    const amount = typeof budget.amount === 'number' 
      ? budget.amount 
      : parseFloat(budget.amount || 0);
    
    // Calculate total spent for this budget by summing related expenses
    const budgetExpenses = expensesList.filter(expense => 
      expense.budgetId && expense.budgetId.toString() === budget._id.toString()
    );
    
    const totalSpend = budgetExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
      
    return {
      ...budget,
      name: budget.name || 'Unnamed',
      amount: isNaN(amount) ? 0 : amount,
      totalSpend: totalSpend,
      // Add a formatted percentage for tooltip
      percentUsed: `${Math.min(100, ((totalSpend / amount) * 100) || 0).toFixed(0)}%`
    };
  }) || [];

  // Safe formatter for currency values
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '0.00';
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    return isNaN(numValue) ? '0.00' : numValue.toFixed(2);
  };

  // Custom tooltip to avoid toFixed errors
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Safely get values from payload
      const spentValue = payload[0]?.value !== undefined ? payload[0].value : 0;
      const budgetValue = payload[1]?.value !== undefined ? payload[1].value : 0;
      
      return (
        <div className="bg-white p-3 border rounded shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">Budget: ₹{formatCurrency(budgetValue)}</p>
          <p className="text-purple-600">Spent: ₹{formatCurrency(spentValue)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="border rounded-2xl p-5">
      <h2 className="font-bold text-lg">Budget Activity</h2>
      {formattedData.length > 0 ? (
        <ResponsiveContainer width={"100%"} height={300}>
          <BarChart
            data={formattedData}
            margin={{
              top: 15,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="totalSpend" name="Spent" stackId="a" fill="#4845d2" />
            <Bar dataKey="amount" name="Budget" stackId="a" fill="#C3C2FF" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No budget data available
        </div>
      )}
    </div>
  );
}

export default BarChartDashboard;
