import { NextResponse } from 'next/server';
import { connectToMongoDB, COLLECTIONS } from '@/utils/mongoSchemas';
import { ObjectId } from 'mongodb';

// Force dynamic to ensure the API route is not statically optimized
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { db } = await connectToMongoDB();
    
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy') || 'default-user';
    
    console.log('Fetching expenses for:', createdBy);
    
    // Get all expenses for the user
    const expenses = await db.collection(COLLECTIONS.EXPENSES)
      .find({ createdBy })
      .sort({ createdAt: -1 })
      .toArray();
    
    // Get all budgets to enrich the expenses with budget details
    const budgets = await db.collection(COLLECTIONS.BUDGETS)
      .find({ createdBy })
      .toArray();
    
    // Create a map of budget IDs to budget objects for quick lookup
    const budgetMap = {};
    budgets.forEach(budget => {
      budgetMap[budget._id.toString()] = budget;
    });
    
    // Enrich expenses with budget details
    const enrichedExpenses = expenses.map(expense => {
      if (expense.budgetId) {
        const budgetIdStr = expense.budgetId.toString();
        const budget = budgetMap[budgetIdStr];
        if (budget) {
          return {
            ...expense,
            budget_name: budget.name,
            budget_icon: budget.icon
          };
        }
      }
      return expense;
    });
    
    console.log('Expenses fetched:', enrichedExpenses.length);
    return NextResponse.json(enrichedExpenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch expenses', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { db } = await connectToMongoDB();
    
    const body = await request.json();
    console.log('Received expense data:', body);
    
    const { name, amount, budgetId, createdBy } = body;
    
    if (!name || !amount) {
      return NextResponse.json({ 
        error: 'Name and amount are required' 
      }, { status: 400 });
    }
    
    const expenseData = {
      name: name,
      amount: parseFloat(amount) || 0,
      budgetId: budgetId ? new ObjectId(budgetId) : null,
      createdBy: createdBy || 'default-user',
      createdAt: new Date()
    };
    
    console.log('Creating expense with data:', expenseData);
    
    const result = await db.collection(COLLECTIONS.EXPENSES).insertOne(expenseData);
    
    // Get the inserted document
    const insertedExpense = await db.collection(COLLECTIONS.EXPENSES).findOne({ _id: result.insertedId });
    
    console.log('Expense created successfully:', insertedExpense);
    return NextResponse.json(insertedExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ 
      error: 'Failed to create expense', 
      details: error.message 
    }, { status: 500 });
  }
} 