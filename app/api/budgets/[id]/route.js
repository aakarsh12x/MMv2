import { NextResponse } from 'next/server';
import { connectToMongoDB, COLLECTIONS } from '@/utils/mongoSchemas';
import { ObjectId } from 'mongodb';

// Force dynamic to ensure the API route is not statically optimized
export const dynamic = 'force-dynamic';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { db } = await connectToMongoDB();
    const body = await request.json();
    const { name, amount, icon } = body;
    
    if (!name || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const result = await db.collection(COLLECTIONS.BUDGETS).updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          name, 
          amount: amount.toString(), 
          icon: icon || '💰',
          updatedAt: new Date()
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    // Get the updated document
    const updatedBudget = await db.collection(COLLECTIONS.BUDGETS).findOne({ _id: new ObjectId(id) });
    
    return NextResponse.json(updatedBudget);
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { db } = await connectToMongoDB();
    
    const result = await db.collection(COLLECTIONS.BUDGETS).deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
  }
} 