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

export async function POST(request) {
  try {
    await connectDB();
    
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
        const newBudget = new Budget({
          name: budget.name,
          amount: budget.amount,
          icon: budget.icon || '💰',
          createdBy
        });
        const savedBudget = await newBudget.save();
        results.budgets.push(savedBudget);
      }
    }
    
    // Import incomes
    if (incomes && incomes.length > 0) {
      for (const income of incomes) {
        const newIncome = new Income({
          name: income.name,
          amount: income.amount,
          icon: income.icon || '💵',
          createdBy
        });
        const savedIncome = await newIncome.save();
        results.incomes.push(savedIncome);
      }
    }
    
    // Import expenses
    if (expenses && expenses.length > 0) {
      for (const expense of expenses) {
        const newExpense = new Expense({
          name: expense.name,
          amount: expense.amount,
          budgetId: expense.budgetId,
          createdBy,
          createdAt: expense.createdAt || new Date().toISOString()
        });
        const savedExpense = await newExpense.save();
        results.expenses.push(savedExpense);
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