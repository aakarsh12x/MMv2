import mongoose from 'mongoose';

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
    required: true,
    default: 'default-user'
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
  frequency: {
    type: String,
    default: 'monthly',
    enum: ['daily', 'weekly', 'monthly', 'yearly']
  },
  date: {
    type: String
  },
  description: {
    type: String
  },
  icon: {
    type: String,
    default: '💵'
  },
  createdBy: {
    type: String,
    required: true,
    default: 'default-user'
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
    required: true,
    default: 'default-user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create models
export const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);
export const Income = mongoose.models.Income || mongoose.model('Income', incomeSchema);
export const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema); 