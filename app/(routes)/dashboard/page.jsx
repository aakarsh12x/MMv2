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

function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  const [error, setError] = useState(null);

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
      // Get budgets for the default user
      const budgetResponse = await fetch(`/api/budgets?createdBy=default-user`);
      if (!budgetResponse.ok) {
        console.error('Budget response not ok:', budgetResponse.status);
        // Use mock data if API fails
        const mockBudgets = [
          {
            _id: '1',
            name: 'Food & Dining',
            amount: '500',
            icon: '🍕',
            totalSpend: 320,
            totalItem: 12
          },
          {
            _id: '2',
            name: 'Transportation',
            amount: '200',
            icon: '🚗',
            totalSpend: 150,
            totalItem: 8
          }
        ];
        setBudgetList(mockBudgets);
        setExpensesList([]);
        getIncomeList();
        return;
      }
      const budgets = await budgetResponse.json();
      console.log('Budgets fetched:', budgets);

      // Get expenses for the default user
      const expenseResponse = await fetch(`/api/expenses?createdBy=default-user`);
      if (!expenseResponse.ok) {
        console.error('Expense response not ok:', expenseResponse.status);
        // Use mock expenses if API fails
        const mockExpenses = [
          {
            _id: '1',
            name: 'Grocery Shopping',
            amount: 120,
            budgetId: { _id: '1' },
            createdAt: new Date()
          },
          {
            _id: '2',
            name: 'Gas',
            amount: 45,
            budgetId: { _id: '2' },
            createdAt: new Date()
          }
        ];
        setExpensesList(mockExpenses);
        getIncomeList();
        return;
      }
      const allExpenses = await expenseResponse.json();
      console.log('Expenses fetched:', allExpenses);

      // Calculate expenses for each budget
      const budgetsWithExpenses = budgets.map(budget => {
        const budgetExpenses = allExpenses.filter(expense => {
          // Handle MongoDB _id
          const expenseBudgetId = expense.budgetId?._id || expense.budgetId;
          const budgetId = budget._id;
          return expenseBudgetId === budgetId;
        });
        
        const totalSpend = budgetExpenses.reduce((sum, expense) => {
          const amount = parseFloat(expense.amount) || 0;
          return sum + amount;
        }, 0);
        const totalItem = budgetExpenses.length;
        
        return {
          ...budget,
          totalSpend,
          totalItem
        };
      });
      
      setBudgetList(budgetsWithExpenses);
      setExpensesList(allExpenses);
      getIncomeList();
    } catch (error) {
      console.error("Error fetching budget list:", error);
      // Use mock data on error
      const mockBudgets = [
        {
          _id: '1',
          name: 'Food & Dining',
          amount: '500',
          icon: '🍕',
          totalSpend: 320,
          totalItem: 12
        },
        {
          _id: '2',
          name: 'Transportation',
          amount: '200',
          icon: '🚗',
          totalSpend: 150,
          totalItem: 8
        }
      ];
      setBudgetList(mockBudgets);
      setExpensesList([]);
      setError('Database connection failed. Showing mock data.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get Income stream list
   */
  const getIncomeList = async () => {
    try {
      console.log('Fetching incomes...');
      // Get incomes for the default user
      const response = await fetch(`/api/incomes?createdBy=default-user`);
      if (!response.ok) {
        console.error('Income response not ok:', response.status);
        // Use mock incomes if API fails
        const mockIncomes = [
          {
            _id: '1',
            name: 'Salary',
            amount: '5000',
            frequency: 'monthly',
            totalAmount: 5000
          },
          {
            _id: '2',
            name: 'Freelance',
            amount: '1500',
            frequency: 'monthly',
            totalAmount: 1500
          }
        ];
        setIncomeList(mockIncomes);
        return;
      }
      const incomes = await response.json();
      console.log('Incomes fetched:', incomes);

      // Calculate total amount for each income
      const incomesWithTotals = incomes.map(income => ({
        ...income,
        totalAmount: parseFloat(income.amount || 0)
      }));

      setIncomeList(incomesWithTotals);
    } catch (error) {
      console.error("Error fetching income list:", error);
      // Use mock data on error
      const mockIncomes = [
        {
          _id: '1',
          name: 'Salary',
          amount: '5000',
          frequency: 'monthly',
          totalAmount: 5000
        },
        {
          _id: '2',
          name: 'Freelance',
          amount: '1500',
          frequency: 'monthly',
          totalAmount: 1500
        }
      ];
      setIncomeList(mockIncomes);
    }
  };

  // Calculate totals for components
  const totalBudget = budgetList?.reduce((sum, budget) => sum + Number(budget.amount || 0), 0) || 0;
  const totalSpend = budgetList?.reduce((sum, budget) => sum + (budget.totalSpend || 0), 0) || 0;
  const totalIncome = incomeList?.reduce((sum, income) => sum + (income.totalAmount || 0), 0) || 0;

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
