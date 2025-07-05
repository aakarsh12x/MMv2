"use client"
import React, { useEffect, useState } from 'react'
import CreateBudget from './CreateBudget'
import { useUser } from '@clerk/nextjs'
import BudgetItem from './BudgetItem'

function BudgetList() {

  const [budgetList,setBudgetList]=useState([]);
  const {user}=useUser();
  useEffect(()=>{
    user&&getBudgetList();
  },[user])
  /**
   * used to get budget List
   */
  const getBudgetList=async()=>{
    try {
      // Get budgets for the current user
      const budgetResponse = await fetch(`/api/budgets?createdBy=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress || '')}`);
      if (!budgetResponse.ok) throw new Error('Failed to fetch budgets');
      const budgets = await budgetResponse.json();

      // Get expenses for the current user
      const expenseResponse = await fetch(`/api/expenses?createdBy=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress || '')}`);
      if (!expenseResponse.ok) throw new Error('Failed to fetch expenses');
      const allExpenses = await expenseResponse.json();

      // Calculate expenses for each budget
      const budgetsWithExpenses = budgets.map(budget => {
        const budgetExpenses = allExpenses.filter(expense => expense.budgetId === budget._id);
        const totalSpend = budgetExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
        const totalItem = budgetExpenses.length;
        
        return {
          ...budget,
          totalSpend,
          totalItem
        };
      });

      setBudgetList(budgetsWithExpenses);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  }

  return (
    <div className='mt-7'>
        <div className='grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <CreateBudget
        refreshData={()=>getBudgetList()}/>
        {budgetList?.length>0? budgetList.map((budget,index)=>(
          <BudgetItem budget={budget} key={index} />
        ))
      :[1,2,3,4,5].map((item,index)=>(
        <div key={index} className='w-full bg-slate-200 rounded-lg
        h-[150px] animate-pulse'>

        </div>
      ))
      }
        </div>
       
    </div>
  )
}

export default BudgetList