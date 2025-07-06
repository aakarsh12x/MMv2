import { NextResponse } from 'next/server';
import { connectToMongoDB, COLLECTIONS } from '@/utils/mongoSchemas';

// Force dynamic to ensure the API route is not statically optimized
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log("Checking MongoDB collections...");
    const { db } = await connectToMongoDB();
    
    // Check if collections exist and get their document counts
    const collections = [COLLECTIONS.BUDGETS, COLLECTIONS.INCOMES, COLLECTIONS.EXPENSES];
    const collectionResults = {};
    
    for (const collectionName of collections) {
      try {
        const count = await db.collection(collectionName).countDocuments();
        collectionResults[collectionName] = {
          exists: true,
          documentCount: count
        };
      } catch (error) {
        collectionResults[collectionName] = {
          exists: false,
          error: error.message
        };
      }
    }
    
    return NextResponse.json({
      collections: collectionResults,
      message: "MongoDB collections checked successfully"
    });
  } catch (error) {
    console.error("Error checking MongoDB collections:", error);
    return NextResponse.json({ 
      error: "Failed to check MongoDB collections", 
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 