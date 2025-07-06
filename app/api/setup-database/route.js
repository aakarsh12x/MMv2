import { NextResponse } from 'next/server';
import { setupDatabase } from '@/utils/dbSetup';

export async function POST() {
  try {
    const result = await setupDatabase();
    
    if (result.success) {
      return NextResponse.json({ 
        message: 'Database setup completed successfully',
        success: true 
      });
    } else {
      return NextResponse.json({ 
        error: 'Database setup failed',
        details: result.error 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in database setup API:', error);
    return NextResponse.json({ 
      error: 'Database setup failed',
      details: error.message 
    }, { status: 500 });
  }
} 