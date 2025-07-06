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

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    const deletedExpense = await Expense.findByIdAndDelete(id);
    
    if (!deletedExpense) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
} 