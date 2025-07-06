import { NextResponse } from 'next/server';
import { connectToMongoDB, COLLECTIONS } from '@/utils/mongoSchemas';
import { ObjectId } from 'mongodb';

// Force dynamic to ensure the API route is not statically optimized
export const dynamic = 'force-dynamic';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { db } = await connectToMongoDB();
    
    const result = await db.collection(COLLECTIONS.EXPENSES).deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
} 