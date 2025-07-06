import { NextResponse } from 'next/server';
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

// Force dynamic to ensure the API route is not statically optimized
export const dynamic = 'force-dynamic';

// Database URL
const DATABASE_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

if (!DATABASE_URL) {
  console.error("ERROR: NEXT_PUBLIC_DATABASE_URL is not defined in environment variables");
  throw new Error("Database connection failed: Missing database URL");
}

// Create the database connection
const sqlClient = neon(DATABASE_URL);
const db = drizzle(sqlClient);

export async function GET() {
  try {
    console.log('Testing database connections...');
    
    // Test budgets table
    const budgets = await db.execute(sql`SELECT COUNT(*) as count FROM budgets`);
    console.log('Budgets count:', budgets.rows[0]?.count);
    
    // Test incomes table
    const incomes = await db.execute(sql`SELECT COUNT(*) as count FROM incomes`);
    console.log('Incomes count:', incomes.rows[0]?.count);
    
    // Test expenses table
    const expenses = await db.execute(sql`SELECT COUNT(*) as count FROM expenses`);
    console.log('Expenses count:', expenses.rows[0]?.count);
    
    return NextResponse.json({
      success: true,
      message: 'All database connections working',
      data: {
        budgets: budgets.rows[0]?.count || 0,
        incomes: incomes.rows[0]?.count || 0,
        expenses: expenses.rows[0]?.count || 0
      }
    });
  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Database test failed', 
      details: error.message 
    }, { status: 500 });
  }
} 