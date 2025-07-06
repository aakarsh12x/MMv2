import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Budget, Income, Expense } from '@/utils/mongoSchemas';

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

export async function GET() {
  try {
    console.log('Testing MongoDB connections...');
    
    await connectDB();
    
    // Test budgets collection
    const budgetsCount = await Budget.countDocuments();
    console.log('Budgets count:', budgetsCount);
    
    // Test incomes collection
    const incomesCount = await Income.countDocuments();
    console.log('Incomes count:', incomesCount);
    
    // Test expenses collection
    const expensesCount = await Expense.countDocuments();
    console.log('Expenses count:', expensesCount);
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connections working',
      data: {
        budgets: budgetsCount,
        incomes: incomesCount,
        expenses: expensesCount
      }
    });
  } catch (error) {
    console.error('MongoDB test failed:', error);
    return NextResponse.json({ 
      success: false,
      error: 'MongoDB test failed', 
      details: error.message 
    }, { status: 500 });
  }
} 