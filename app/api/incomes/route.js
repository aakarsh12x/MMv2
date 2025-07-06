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

// Function to ensure the incomes table has all required columns
async function ensureIncomesTable() {
  try {
    // Check if the incomes table exists and has required columns
    const columns = await db.execute(sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'incomes'
    `);
    
    const columnNames = columns.rows.map(col => col.column_name);
    const requiredColumns = ['frequency', 'date', 'description'];
    const missingColumns = requiredColumns.filter(col => !columnNames.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('Adding missing columns to incomes table:', missingColumns);
      
      // Add missing columns
      for (const column of missingColumns) {
        if (column === 'frequency') {
          await db.execute(sql`ALTER TABLE incomes ADD COLUMN IF NOT EXISTS frequency VARCHAR DEFAULT 'monthly'`);
        } else if (column === 'date') {
          await db.execute(sql`ALTER TABLE incomes ADD COLUMN IF NOT EXISTS date VARCHAR`);
        } else if (column === 'description') {
          await db.execute(sql`ALTER TABLE incomes ADD COLUMN IF NOT EXISTS description TEXT`);
        }
      }
      
      console.log('Successfully added missing columns to incomes table');
    }
  } catch (error) {
    console.error('Error ensuring incomes table structure:', error);
    throw error;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy') || 'default-user';
    
    // Ensure table structure
    await ensureIncomesTable();
    
    const incomes = await db.execute(sql`
      SELECT * FROM incomes WHERE "createdBy" = ${createdBy} ORDER BY "createdAt" DESC
    `);
    
    return NextResponse.json(incomes.rows);
  } catch (error) {
    console.error('Error fetching incomes:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch incomes', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received income data:', body);
    
    // Ensure table structure
    await ensureIncomesTable();
    
    const { source, amount, frequency, date, description, createdBy } = body;
    
    if (!source || !amount) {
      return NextResponse.json({ 
        error: 'Source and amount are required' 
      }, { status: 400 });
    }
    
    const incomeData = {
      name: source,
      amount: amount.toString(),
      icon: '💵',
      frequency: frequency || 'monthly',
      date: date || new Date().toISOString().split('T')[0],
      description: description || '',
      createdBy: createdBy || 'default-user'
    };
    
    console.log('Inserting income with data:', incomeData);
    
    const result = await db.execute(sql`
      INSERT INTO incomes (name, amount, icon, frequency, date, description, "createdBy")
      VALUES (${incomeData.name}, ${incomeData.amount}, ${incomeData.icon}, ${incomeData.frequency}, ${incomeData.date}, ${incomeData.description}, ${incomeData.createdBy})
      RETURNING *
    `);
    
    console.log('Income created successfully:', result.rows[0]);
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating income:', error);
    return NextResponse.json({ 
      error: 'Failed to create income', 
      details: error.message 
    }, { status: 500 });
  }
} 