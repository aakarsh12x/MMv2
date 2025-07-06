import { NextResponse } from 'next/server';

// Force dynamic to ensure the API route is not statically optimized
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing frontend API endpoint...');
    
    return NextResponse.json({
      success: true,
      message: 'Frontend API is working correctly',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('Frontend test failed:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Frontend test failed', 
      details: error.message 
    }, { status: 500 });
  }
} 