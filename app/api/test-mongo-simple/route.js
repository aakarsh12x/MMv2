import { NextResponse } from 'next/server';
import { MongoClient, ServerApiVersion } from 'mongodb';

// Force dynamic to ensure the API route is not statically optimized
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    
    if (!process.env.MONGODB_URI) {
      console.log('MONGODB_URI not set');
      return NextResponse.json({ 
        success: false,
        error: 'MONGODB_URI not set' 
      }, { status: 500 });
    }
    
    console.log('MONGODB_URI is set, attempting connection...');
    
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    const client = new MongoClient(process.env.MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    
    // Connect to the MongoDB server
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB connection successful!");
    
    // Get list of databases
    const adminDb = client.db("admin");
    const dbs = await adminDb.admin().listDatabases();
    const dbList = dbs.databases.map(db => db.name);
    
    // Close the connection
    await client.close();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      databases: dbList
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