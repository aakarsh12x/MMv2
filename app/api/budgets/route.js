import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// MongoDB connection URL
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://aakarshshrey12:2KqzcQbZAyZh8oDV@mongocluster.hv68hsv.mongodb.net/?retryWrites=true&w=majority&appName=MongoCluster";

// Connect to MongoDB
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
}

// Budget Schema
const budgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  icon: {
    type: String,
    default: '💰'
  },
  createdBy: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy');
    
    if (!createdBy) {
      return NextResponse.json({ error: 'createdBy parameter is required' }, { status: 400 });
    }
    
    const budgets = await Budget.find({ createdBy }).sort({ createdAt: -1 });
    
    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, amount, icon, createdBy } = body;
    
    if (!name || !amount || !createdBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const budget = new Budget({
      name,
      amount: parseFloat(amount),
      icon: icon || '💰',
      createdBy
    });
    
    const savedBudget = await budget.save();
    
    return NextResponse.json(savedBudget, { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ error: 'Failed to create budget' }, { status: 500 });
  }
} 