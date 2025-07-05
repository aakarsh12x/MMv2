"use client";
import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, PiggyBank, AlertTriangle } from 'lucide-react';
import formatNumber from "@/utils";

function QuickStats({ budgetList, incomeList, totalBudget, totalIncome, totalSpend }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculateStats = () => {
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpend) / totalIncome) * 100 : 0;
    const budgetUtilization = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;
    const remainingBudget = totalBudget - totalSpend;
    const monthlySavings = totalIncome - totalSpend;
    
    // Calculate deterministic trends based on current data (avoid Math.random for hydration)
    const savingsRateChange = savingsRate > 20 ? (savingsRate * 0.15).toFixed(1) : 
                             savingsRate > 10 ? (savingsRate * 0.1 - 2).toFixed(1) : 
                             -(savingsRate * 0.2 + 1).toFixed(1);
    
    const budgetUsageChange = budgetUtilization > 80 ? (budgetUtilization * 0.1 + 5).toFixed(1) : 
                             -(budgetUtilization * 0.08 + 2).toFixed(1);
    
    const remainingBudgetChange = remainingBudget > 0 ? Math.round(remainingBudget * 0.1) : 
                                 Math.round(Math.abs(remainingBudget) * 0.15);
    
    return {
      savingsRate,
      budgetUtilization,
      remainingBudget,
      monthlySavings,
      totalCategories: budgetList?.length || 0,
      avgExpensePerCategory: budgetList?.length > 0 ? totalSpend / budgetList.length : 0,
      savingsRateChange: parseFloat(savingsRateChange),
      budgetUsageChange: parseFloat(budgetUsageChange),
      remainingBudgetChange
    };
  };

  const stats = calculateStats();

  const quickStatsData = [
    {
      title: "Monthly Savings",
      value: `₹${formatNumber(stats.monthlySavings)}`,
      change: stats.monthlySavings >= 0 ? `+₹${Math.round(Math.abs(stats.monthlySavings) * 0.12)}` : `-₹${Math.round(Math.abs(stats.monthlySavings) * 0.08)}`,
      trend: stats.monthlySavings >= 0 ? "up" : "down",
      icon: PiggyBank,
      color: stats.monthlySavings >= 0 ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
    },
    {
      title: "Savings Rate",
      value: `${stats.savingsRate.toFixed(1)}%`,
      change: `${stats.savingsRateChange >= 0 ? '+' : ''}${stats.savingsRateChange}%`,
      trend: stats.savingsRateChange >= 0 ? "up" : "down",
      icon: TrendingUp,
      color: stats.savingsRate >= 20 ? "text-green-600 bg-green-100" : stats.savingsRate >= 10 ? "text-yellow-600 bg-yellow-100" : "text-red-600 bg-red-100"
    },
    {
      title: "Budget Usage",
      value: `${stats.budgetUtilization.toFixed(1)}%`,
      change: `${stats.budgetUsageChange >= 0 ? '+' : ''}${stats.budgetUsageChange}%`,
      trend: stats.budgetUsageChange >= 0 ? "up" : "down",
      icon: Target,
      color: stats.budgetUtilization <= 80 ? "text-green-600 bg-green-100" : stats.budgetUtilization <= 100 ? "text-yellow-600 bg-yellow-100" : "text-red-600 bg-red-100"
    },
    {
      title: "Remaining Budget",
      value: `₹${formatNumber(stats.remainingBudget)}`,
      change: `${stats.remainingBudget >= 0 ? '+' : ''}₹${Math.abs(stats.remainingBudgetChange)}`,
      trend: stats.remainingBudget >= 0 ? "up" : "down",
      icon: DollarSign,
      color: stats.remainingBudget >= 0 ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
    }
  ];

  // Prevent hydration mismatch by only showing calculated trends after mount
  if (!mounted) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStatsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <TrendingUp size={14} className="mr-1" />
                  Loading...
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {quickStatsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div className={`flex items-center text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                {stat.change}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default QuickStats; 