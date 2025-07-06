import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Budget } from '@/utils/mongoSchemas';

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
    
    console.log('Fetching budgets for:', createdBy);
    
    const budgets = await Budget.find({ createdBy })
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('Budgets fetched:', budgets.length);
    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch budgets', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    console.log('Received budget data:', body);
    
    const { name, amount, icon, createdBy } = body;
    
    if (!name || !amount) {
      return NextResponse.json({ 
        error: 'Name and amount are required' 
      }, { status: 400 });
    }
    
    const budgetData = {
      name: name,
      amount: amount.toString(),
      icon: icon || '💰',
      createdBy: createdBy || 'default-user'
    };
    
    console.log('Creating budget with data:', budgetData);
    
    const budget = new Budget(budgetData);
    const savedBudget = await budget.save();
    
    console.log('Budget created successfully:', savedBudget);
    return NextResponse.json(savedBudget);
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ 
      error: 'Failed to create budget', 
      details: error.message 
    }, { status: 500 });
  }
} 