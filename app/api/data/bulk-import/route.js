import { NextResponse } from 'next/server';
import { connectToMongoDB, COLLECTIONS } from '@/utils/mongoSchemas';
import { ObjectId } from 'mongodb';

// Force dynamic to ensure the API route is not statically optimized
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { db } = await connectToMongoDB();
    const body = await request.json();
    const { budgets, expenses, incomes, createdBy } = body;
    
    if (!createdBy) {
      return NextResponse.json({ error: 'createdBy parameter is required' }, { status: 400 });
    }
    
    const results = {
      budgets: [],
      expenses: [],
      incomes: []
    };
    
    // Import budgets
    if (budgets && budgets.length > 0) {
      for (const budget of budgets) {
        const budgetData = {
          name: budget.name,
          amount: budget.amount.toString(),
          icon: budget.icon || '💰',
          createdBy,
          createdAt: new Date()
        };
        
        const result = await db.collection(COLLECTIONS.BUDGETS).insertOne(budgetData);
        const insertedBudget = await db.collection(COLLECTIONS.BUDGETS).findOne({ _id: result.insertedId });
        results.budgets.push(insertedBudget);
      }
    }
    
    // Import incomes
    if (incomes && incomes.length > 0) {
      for (const income of incomes) {
        const incomeData = {
          name: income.name,
          amount: income.amount.toString(),
          icon: income.icon || '💵',
          frequency: income.frequency || 'monthly',
          date: income.date || new Date().toISOString().split('T')[0],
          description: income.description || '',
          createdBy,
          createdAt: new Date()
        };
        
        const result = await db.collection(COLLECTIONS.INCOMES).insertOne(incomeData);
        const insertedIncome = await db.collection(COLLECTIONS.INCOMES).findOne({ _id: result.insertedId });
        results.incomes.push(insertedIncome);
      }
    }
    
    // Import expenses
    if (expenses && expenses.length > 0) {
      for (const expense of expenses) {
        const expenseData = {
          name: expense.name,
          amount: parseFloat(expense.amount) || 0,
          budgetId: expense.budgetId ? new ObjectId(expense.budgetId) : null,
          createdBy,
          createdAt: new Date()
        };
        
        const result = await db.collection(COLLECTIONS.EXPENSES).insertOne(expenseData);
        const insertedExpense = await db.collection(COLLECTIONS.EXPENSES).findOne({ _id: result.insertedId });
        results.expenses.push(insertedExpense);
      }
    }
    
    return NextResponse.json({
      message: 'Data imported successfully',
      results
    }, { status: 201 });
  } catch (error) {
    console.error('Error importing data:', error);
    return NextResponse.json({ error: 'Failed to import data' }, { status: 500 });
  }
} 