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

const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const body = await request.json();
    const { name, amount, icon } = body;
    
    if (!name || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const updatedBudget = await Budget.findByIdAndUpdate(
      id,
      {
        name,
        amount,
        icon: icon || '💰'
      },
      { new: true }
    );
    
    if (!updatedBudget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedBudget);
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    const deletedBudget = await Budget.findByIdAndDelete(id);
    
    if (!deletedBudget) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
  }
} 