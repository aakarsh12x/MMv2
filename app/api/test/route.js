import { NextResponse } from 'next/server';
import { connectToMongoDB, COLLECTIONS } from '@/utils/mongoSchemas';

// Force dynamic to ensure the API route is not statically optimized
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing MongoDB connections...');
    const { db } = await connectToMongoDB();
    
    // Test budgets collection
    const budgetsCount = await db.collection(COLLECTIONS.BUDGETS).countDocuments();
    console.log('Budgets count:', budgetsCount);
    
    // Test incomes collection
    const incomesCount = await db.collection(COLLECTIONS.INCOMES).countDocuments();
    console.log('Incomes count:', incomesCount);
    
    // Test expenses collection
    const expensesCount = await db.collection(COLLECTIONS.EXPENSES).countDocuments();
    console.log('Expenses count:', expensesCount);
    
    return NextResponse.json({
      success: true,
      message: 'All MongoDB connections working',
      data: {
        budgets: budgetsCount,
        incomes: incomesCount,
        expenses: expensesCount
      }
    });
  } catch (error) {
    console.error('MongoDB test failed:', error);
    return NextResponse.json({ 
      success: false,
      error: 'MongoDB test failed', 
      details: error.message 
    }, { status: 500 });
  }
} 