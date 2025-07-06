import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

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

// Budget Schema
const budgetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: String,
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

// Income Schema
const incomeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '💵'
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

const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);
const Income = mongoose.models.Income || mongoose.model('Income', incomeSchema);
const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

export async function GET(request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy');
    
    if (!createdBy) {
      return NextResponse.json({ error: 'createdBy parameter is required' }, { status: 400 });
    }
    
    // Fetch all data for the user
    const [budgets, expenses, incomes] = await Promise.all([
      Budget.find({ createdBy }).sort({ createdAt: -1 }),
      Expense.find({ createdBy }).populate('budgetId').sort({ createdAt: -1 }),
      Income.find({ createdBy }).sort({ createdAt: -1 })
    ]);
    
    const exportData = {
      exportDate: new Date().toISOString(),
      user: createdBy,
      data: {
        budgets,
        expenses,
        incomes
      }
    };
    
    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
} 