import { NextResponse } from 'next/server';
import { setupDatabase } from '@/utils/dbSetup';

// Force dynamic to ensure the API route is not statically optimized
export const dynamic = 'force-dynamic';

// Allow both GET and POST methods to setup the database
export async function GET() {
  return handleSetupDatabase();
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