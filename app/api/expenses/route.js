import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Expense, Budget } from '@/utils/mongoSchemas';

// Force dynamic to ensure the API route is not statically optimized
export const dynamic = 'force-dynamic';

// MongoDB connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('MongoDB connected');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy') || 'default-user';
    
    console.log('Fetching expenses for:', createdBy);
    
    const expenses = await Expense.find({ createdBy })
      .populate('budgetId', 'name icon')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('Expenses fetched:', expenses.length);
    return NextResponse.json(expenses);
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
    await connectDB();
    
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
      budgetId: budgetId || null,
      createdBy: createdBy || 'default-user'
    };
    
    console.log('Creating expense with data:', expenseData);
    
    const expense = new Expense(expenseData);
    const savedExpense = await expense.save();
    
    console.log('Expense created successfully:', savedExpense);
    return NextResponse.json(savedExpense);
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ 
      error: 'Failed to create expense', 
      details: error.message 
    }, { status: 500 });
  }
} 