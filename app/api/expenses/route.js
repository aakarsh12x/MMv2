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
const sql = neon(DATABASE_URL);
const db = drizzle(sql);

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy') || 'default-user';
    
    const expenses = await db.execute(
      sql`SELECT e.*, b.name as budget_name, b.icon as budget_icon 
          FROM expenses e 
          LEFT JOIN budgets b ON e."budgetId" = b.id 
          WHERE e."createdBy" = ${createdBy} 
          ORDER BY e."createdAt" DESC`
    );
    
    return NextResponse.json(expenses.rows);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Failed to fetch expenses' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, amount, budgetId, createdBy } = body;
    
    if (!name || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const result = await db.execute(
      sql`INSERT INTO expenses (name, amount, "budgetId", "createdBy", "createdAt") 
          VALUES (${name}, ${amount}, ${budgetId || null}, ${createdBy || 'default-user'}, NOW())
          RETURNING *`
    );
    
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
} 