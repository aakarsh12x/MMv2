"use client";
import React, { useEffect, useState } from "react";
import CardInfo from "./_components/CardInfo";
import BarChartDashboard from "./_components/BarChartDashboard";
import SmartInsights from "./_components/SmartInsights";
import SmartGoals from "./_components/SmartGoals";
import QuickStats from "./_components/QuickStats";
import RecentTransactions from "./_components/RecentTransactions";
import QuickActions from "./_components/QuickActions";
import SpendingAnalytics from "./_components/SpendingAnalytics";
import { getUserId } from '@/utils/userContext';

function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [error, setError] = useState(null);
  const [totals, setTotals] = useState({
    totalBudget: 0,
    totalSpent: 0,
    totalIncome: 0,
  });

  const userId = getUserId();

  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  useEffect(() => {
    setMounted(true);
    getBudgetList();
  }, []);
  
  /**
   * Get Budget list
   */
  const getBudgetList = async () => {
    try {
      console.log('Fetching budgets...');
      const response = await fetch(`/api/budgets?createdBy=${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Budgets fetched:', data);
      setBudgetList(data);
      getExpensesList();
      getIncomeList();
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setBudgetList([]);
      setExpensesList([]);
      setError('Database connection failed. Showing mock data.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get Expenses list
   */
  const getExpensesList = async () => {
    try {
      console.log('Fetching expenses...');
      const response = await fetch(`/api/expenses?createdBy=${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Expenses fetched:', data);
      setExpensesList(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setExpensesList([]);
    }
  };

  /**
   * Get Income stream list
   */
  const getIncomeList = async () => {
    try {
      console.log('Fetching incomes...');
      const response = await fetch(`/api/incomes?createdBy=${userId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Incomes fetched:', data);
      setIncomeList(data);
    } catch (error) {
      console.error('Error fetching incomes:', error);
      setIncomeList([]);
    }
  };

  // Calculate totals for components
  const totalBudget = budgetList?.reduce((sum, budget) => sum + Number(budget.amount || 0), 0) || 0;
  const totalSpend = expensesList?.reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0;
  const totalIncome = incomeList?.reduce((sum, income) => sum + Number(income.amount || 0), 0) || 0;

  console.log('Dashboard totals:', { totalBudget, totalSpend, totalIncome });

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return (
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to MoneyMap! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Loading your financial overview...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to MoneyMap! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here's your financial overview for today
          </p>
          {error && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800 text-sm">{error}</p>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-gray-500">Today</p>
            <p className="font-semibold text-gray-900">
              {currentDate}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <QuickStats 
        budgetList={budgetList}
        incomeList={incomeList}
        totalBudget={totalBudget}
        totalIncome={totalIncome}
        totalSpend={totalSpend}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Main Charts and Analytics */}
        <div className="xl:col-span-2 space-y-8">
          {/* Financial Cards */}
          <CardInfo 
            budgetList={budgetList} 
            incomeList={incomeList}
            isLoading={isLoading}
          />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <BarChartDashboard budgetList={budgetList} />
            <SpendingAnalytics budgetList={budgetList} />
          </div>
          
          {/* Recent Transactions */}
          <RecentTransactions 
            expensesList={expensesList}
            incomeList={incomeList}
          />

          {/* Smart Insights */}
          <SmartInsights 
            budgetList={budgetList}
            incomeList={incomeList}
            totalSpend={totalSpend}
            totalBudget={totalBudget}
            totalIncome={totalIncome}
          />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <QuickActions />

          {/* Smart Goals */}
          <SmartGoals 
            budgetList={budgetList}
            totalSpend={totalSpend}
            totalBudget={totalBudget}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
