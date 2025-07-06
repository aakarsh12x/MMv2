import { NextResponse } from 'next/server';
import { connectToMongoDB, COLLECTIONS } from '@/utils/mongoSchemas';

// Force dynamic to ensure the API route is not statically optimized
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { db } = await connectToMongoDB();
    
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy') || 'default-user';
    
    console.log('Fetching incomes for:', createdBy);
    
    const incomes = await db.collection(COLLECTIONS.INCOMES)
      .find({ createdBy })
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log('Incomes fetched:', incomes.length);
    return NextResponse.json(incomes);
  } catch (error) {
    console.error('Error fetching incomes:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch incomes', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { db } = await connectToMongoDB();
    
    const body = await request.json();
    console.log('Received income data:', body);
    
    const { source, amount, frequency, date, description, createdBy } = body;
    
    if (!source || !amount) {
      return NextResponse.json({ 
        error: 'Source and amount are required' 
      }, { status: 400 });
    }
    
    const incomeData = {
      name: source,
      amount: amount.toString(),
      icon: '💵',
      frequency: frequency || 'monthly',
      date: date || new Date().toISOString().split('T')[0],
      description: description || '',
      createdBy: createdBy || 'default-user',
      createdAt: new Date()
    };
    
    console.log('Creating income with data:', incomeData);
    
    const result = await db.collection(COLLECTIONS.INCOMES).insertOne(incomeData);
    
    // Get the inserted document
    const insertedIncome = await db.collection(COLLECTIONS.INCOMES).findOne({ _id: result.insertedId });
    
    console.log('Income created successfully:', insertedIncome);
    return NextResponse.json(insertedIncome);
  } catch (error) {
    console.error('Error creating income:', error);
    return NextResponse.json({ 
      error: 'Failed to create income', 
      details: error.message 
    }, { status: 500 });
  }
} 