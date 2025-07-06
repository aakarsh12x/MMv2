import { NextResponse } from 'next/server';
import { connectToMongoDB, COLLECTIONS } from '@/utils/mongoSchemas';
import { ObjectId } from 'mongodb';

// Force dynamic to ensure the API route is not statically optimized
export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { db } = await connectToMongoDB();
    
    if (!id) {
      return NextResponse.json({ error: 'Income ID is required' }, { status: 400 });
    }
    
    const income = await db.collection(COLLECTIONS.INCOMES).findOne({ _id: new ObjectId(id) });
    
    if (!income) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 });
    }
    
    return NextResponse.json(income);
  } catch (error) {
    console.error('Error fetching income:', error);
    return NextResponse.json({ error: 'Failed to fetch income', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const { db } = await connectToMongoDB();
    
    if (!id) {
      return NextResponse.json({ error: 'Income ID is required' }, { status: 400 });
    }
    
    console.log(`Attempting to delete income with ID: ${id}`);
    
    const result = await db.collection(COLLECTIONS.INCOMES).deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 });
    }
    
    console.log('Income deleted successfully');
    return NextResponse.json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error('Error deleting income:', error);
    return NextResponse.json({ error: 'Failed to delete income', details: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { db } = await connectToMongoDB();
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Income ID is required' }, { status: 400 });
    }
    
    const { name, amount, frequency, date, description, icon } = body;
    
    if (!name && !amount && !frequency && !date && !description && !icon) {
      return NextResponse.json({ error: 'At least one field to update is required' }, { status: 400 });
    }
    
    // Build the update object dynamically based on provided fields
    const updateData = {};
    
    if (name) updateData.name = name;
    if (amount) updateData.amount = amount.toString();
    if (frequency) updateData.frequency = frequency;
    if (date) updateData.date = date;
    if (description) updateData.description = description;
    if (icon) updateData.icon = icon;
    
    updateData.updatedAt = new Date();
    
    const result = await db.collection(COLLECTIONS.INCOMES).updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 });
    }
    
    // Get the updated document
    const updatedIncome = await db.collection(COLLECTIONS.INCOMES).findOne({ _id: new ObjectId(id) });
    
    return NextResponse.json(updatedIncome);
  } catch (error) {
    console.error('Error updating income:', error);
    return NextResponse.json({ error: 'Failed to update income', details: error.message }, { status: 500 });
  }
} 