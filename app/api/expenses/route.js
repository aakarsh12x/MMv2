import { NextResponse } from 'next/server';
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

// Database URL
const DATABASE_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

if (!DATABASE_URL) {
  console.error("ERROR: NEXT_PUBLIC_DATABASE_URL is not defined in environment variables");
  throw new Error("Database connection failed: Missing database URL");
}

// Create the database connection
const sqlClient = neon(DATABASE_URL);
const db = drizzle(sqlClient);

// Force dynamic to ensure the API route is not statically optimized
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy') || 'default-user';
    
    console.log('Fetching expenses for:', createdBy);
    
    const expenses = await db.execute(
      sql`SELECT e.*, b.name as budget_name, b.icon as budget_icon 
          FROM expenses e 
          LEFT JOIN budgets b ON e."budgetId" = b.id 
          WHERE e."createdBy" = ${createdBy} 
          ORDER BY e."createdAt" DESC`
    );
    
    console.log('Expenses fetched:', expenses.rows.length);
    return NextResponse.json(expenses.rows);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch expenses', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received expense data:', body);
    
    const { name, amount, budgetId, createdBy } = body;
    
    if (!name || !amount) {
      return NextResponse.json({ 
        error: 'Name and amount are required' 
      }, { status: 400 });
    }
    
    const expenseData = {
      name: name,
      amount: amount.toString(),
      budgetId: budgetId || null,
      createdBy: createdBy || 'default-user'
    };
    
    console.log('Inserting expense with data:', expenseData);
    
    const result = await db.execute(
      sql`INSERT INTO expenses (name, amount, "budgetId", "createdBy")
          VALUES (${expenseData.name}, ${expenseData.amount}, ${expenseData.budgetId}, ${expenseData.createdBy})
          RETURNING *`
    );
    
    console.log('Expense created successfully:', result.rows[0]);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ 
      error: 'Failed to create expense', 
      details: error.message 
    }, { status: 500 });
  }
} 