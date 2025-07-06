import { NextResponse } from 'next/server';
import { connectToMongoDB, COLLECTIONS } from '@/utils/mongoSchemas';

// Force dynamic to ensure the API route is not statically optimized
export const dynamic = 'force-dynamic';

// Allow both GET and POST methods to setup the database
export async function GET() {
  try {
    console.log('Starting database setup...');
    
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not set');
      return NextResponse.json({ 
        success: false,
        error: 'MONGODB_URI not set' 
      }, { status: 500 });
    }
    
    const { db } = await connectToMongoDB();
    
    console.log('Setting up database collections...');
    
    // Create collections if they don't exist
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(col => col.name);
    
    // Check and create budgets collection
    if (!collectionNames.includes(COLLECTIONS.BUDGETS)) {
      await db.createCollection(COLLECTIONS.BUDGETS);
      console.log(`Created ${COLLECTIONS.BUDGETS} collection`);
    }
    
    // Check and create incomes collection
    if (!collectionNames.includes(COLLECTIONS.INCOMES)) {
      await db.createCollection(COLLECTIONS.INCOMES);
      console.log(`Created ${COLLECTIONS.INCOMES} collection`);
    }
    
    // Check and create expenses collection
    if (!collectionNames.includes(COLLECTIONS.EXPENSES)) {
      await db.createCollection(COLLECTIONS.EXPENSES);
      console.log(`Created ${COLLECTIONS.EXPENSES} collection`);
    }
    
    // Create indexes for better performance
    await db.collection(COLLECTIONS.BUDGETS).createIndex({ createdBy: 1 });
    await db.collection(COLLECTIONS.INCOMES).createIndex({ createdBy: 1 });
    await db.collection(COLLECTIONS.EXPENSES).createIndex({ createdBy: 1 });
    await db.collection(COLLECTIONS.EXPENSES).createIndex({ budgetId: 1 });
    
    console.log('Database collections created successfully!');
    
    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully',
      collections: [
        COLLECTIONS.BUDGETS,
        COLLECTIONS.INCOMES,
        COLLECTIONS.EXPENSES
      ]
    });
  } catch (error) {
    console.error('Database setup failed:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Database setup failed', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST() {
  return handleSetupDatabase();
}

// Common function to handle database setup
async function handleSetupDatabase() {
  try {
    console.log('Starting database setup...');
    const result = await setupDatabase();
    
    if (result.success) {
      console.log('Database setup completed successfully');
      return NextResponse.json({ 
        message: 'Database setup completed successfully',
        success: true 
      });
    } else {
      console.error('Database setup failed:', result.error);
      return NextResponse.json({ 
        error: 'Database setup failed',
        details: result.error 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in database setup API:', error);
    return NextResponse.json({ 
      error: 'Database setup failed',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 