import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { Income } from '@/utils/mongoSchemas';

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
    
    console.log('Fetching incomes for:', createdBy);
    
    const incomes = await Income.find({ createdBy })
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('Incomes fetched:', incomes.length);
    return NextResponse.json(incomes);
  } catch (error) {
    console.error('Error fetching incomes:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch incomes', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    console.log('Received income data:', body);
    
    const { source, amount, frequency, date, description, createdBy } = body;
    
    if (!source || !amount) {
      return NextResponse.json({ 
        error: 'Source and amount are required' 
      }, { status: 400 });
    }
    
    const incomeData = {
      name: source,
      amount: amount.toString(),
      icon: '💵',
      frequency: frequency || 'monthly',
      date: date || new Date().toISOString().split('T')[0],
      description: description || '',
      createdBy: createdBy || 'default-user'
    };
    
    console.log('Creating income with data:', incomeData);
    
    const income = new Income(incomeData);
    const savedIncome = await income.save();
    
    console.log('Income created successfully:', savedIncome);
    return NextResponse.json(savedIncome);
  } catch (error) {
    console.error('Error creating income:', error);
    return NextResponse.json({ 
      error: 'Failed to create income', 
      details: error.message 
    }, { status: 500 });
  }
} 