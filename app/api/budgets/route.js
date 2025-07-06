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

// Function to ensure the budgets table has all required columns
async function ensureBudgetsTable() {
  try {
    // Check if the budgets table exists and has required columns
    const columns = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'budgets'
    `);
    
    const columnNames = columns.rows.map(col => col.column_name);
    const requiredColumns = ['name', 'amount', 'icon', 'createdBy'];
    const missingColumns = requiredColumns.filter(col => !columnNames.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('Adding missing columns to budgets table:', missingColumns);
      
      // Add missing columns
      for (const column of missingColumns) {
        if (column === 'name') {
          await db.execute(sql`ALTER TABLE budgets ADD COLUMN IF NOT EXISTS name VARCHAR NOT NULL DEFAULT ''`);
        } else if (column === 'amount') {
          await db.execute(sql`ALTER TABLE budgets ADD COLUMN IF NOT EXISTS amount VARCHAR NOT NULL DEFAULT '0'`);
        } else if (column === 'icon') {
          await db.execute(sql`ALTER TABLE budgets ADD COLUMN IF NOT EXISTS icon VARCHAR`);
        } else if (column === 'createdBy') {
          await db.execute(sql`ALTER TABLE budgets ADD COLUMN IF NOT EXISTS "createdBy" VARCHAR NOT NULL DEFAULT 'default-user'`);
        }
      }
      
      console.log('Successfully added missing columns to budgets table');
    }
  } catch (error) {
    console.error('Error ensuring budgets table structure:', error);
    throw error;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy') || 'default-user';
    
    // Ensure table structure
    await ensureBudgetsTable();
    
    const budgets = await db.execute(sql`
      SELECT * FROM budgets WHERE "createdBy" = ${createdBy} ORDER BY "createdAt" DESC
    `);
    
    return NextResponse.json(budgets.rows);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch budgets', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received budget data:', body);
    
    // Ensure table structure
    await ensureBudgetsTable();
    
    const { name, amount, icon, createdBy } = body;
    
    if (!name || !amount) {
      return NextResponse.json({ 
        error: 'Name and amount are required' 
      }, { status: 400 });
    }
    
    const budgetData = {
      name: name,
      amount: amount.toString(),
      icon: icon || '💰',
      createdBy: createdBy || 'default-user'
    };
    
    console.log('Inserting budget with data:', budgetData);
    
    const result = await db.execute(sql`
      INSERT INTO budgets (name, amount, icon, "createdBy")
      VALUES (${budgetData.name}, ${budgetData.amount}, ${budgetData.icon}, ${budgetData.createdBy})
      RETURNING *
    `);
    
    console.log('Budget created successfully:', result.rows[0]);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ 
      error: 'Failed to create budget', 
      details: error.message 
    }, { status: 500 });
  }
} 