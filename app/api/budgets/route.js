import { NextResponse } from 'next/server';
import { connectToMongoDB, COLLECTIONS } from '@/utils/mongoSchemas';

// Force dynamic to ensure the API route is not statically optimized
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { db } = await connectToMongoDB();
    
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy') || 'default-user';
    
    console.log('Fetching budgets for:', createdBy);
    
    const budgets = await db.collection(COLLECTIONS.BUDGETS)
      .find({ createdBy })
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log('Budgets fetched:', budgets.length);
    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch budgets', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { db } = await connectToMongoDB();
    
    const body = await request.json();
    console.log('Received budget data:', body);
    
    const { name, amount, icon, createdBy } = body;
    
    if (!name || !amount) {
      return NextResponse.json({ 
        error: 'Name and amount are required' 
      }, { status: 400 });
    }
    
    const budgetData = {
      name: name,
      amount: amount.toString(),
      icon: icon || '💰',
      createdBy: createdBy || 'default-user',
      createdAt: new Date()
    };
    
    console.log('Creating budget with data:', budgetData);
    
    const result = await db.collection(COLLECTIONS.BUDGETS).insertOne(budgetData);
    
    // Get the inserted document
    const insertedBudget = await db.collection(COLLECTIONS.BUDGETS).findOne({ _id: result.insertedId });
    
    console.log('Budget created successfully:', insertedBudget);
    return NextResponse.json(insertedBudget);
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ 
      error: 'Failed to create budget', 
      details: error.message 
    }, { status: 500 });
  }
} 