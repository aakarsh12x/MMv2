import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// MongoDB connection URL
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

// Expense Schema
const expenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget'
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    required: true
  }
});

const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy');
    
    if (!createdBy) {
      return NextResponse.json({ error: 'createdBy parameter is required' }, { status: 400 });
    }
    
    const expenses = await Expense.find({ createdBy }).populate('budgetId').sort({ createdAt: -1 });
    
    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, amount, budgetId, createdBy } = body;
    
    if (!name || !amount || !createdBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const expense = new Expense({
      name,
      amount: parseFloat(amount),
      budgetId,
      createdBy,
      createdAt: new Date().toISOString()
    });
    
    const savedExpense = await expense.save();
    
    return NextResponse.json(savedExpense, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
} 