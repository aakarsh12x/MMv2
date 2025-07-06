import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Force dynamic to ensure the API route is not statically optimized
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      return NextResponse.json({ 
        success: false,
        error: 'MONGODB_URI environment variable is not set'
      }, { status: 500 });
    }
    
    console.log('MONGODB_URI is set, attempting connection...');
    
    // Create a new MongoClient
    const client = new MongoClient(process.env.MONGODB_URI);
    
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB server');
    
    // Get list of databases
    const adminDb = client.db('admin');
    const dbs = await adminDb.admin().listDatabases();
    const dbNames = dbs.databases.map(db => db.name);
    
    // Close the connection
    await client.close();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      databases: dbNames
    });
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return NextResponse.json({ 
      success: false,
      error: 'MongoDB connection test failed', 
      details: error.message 
    }, { status: 500 });
  }
} 