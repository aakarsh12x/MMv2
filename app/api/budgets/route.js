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
    
    const budgets = await db.execute(
      sql`SELECT * FROM budgets WHERE "createdBy" = ${createdBy} ORDER BY "createdAt" DESC`
    );
    
    return NextResponse.json(budgets.rows);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Failed to fetch budgets', details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Received budget data:', body);
    
    const { name, amount, icon, createdBy } = body;
    
    if (!name || !amount) {
      console.error('Missing required fields:', { name, amount });
      return NextResponse.json({ 
        error: 'Missing required fields',
        required: ['name', 'amount'],
        received: body
      }, { status: 400 });
    }
    
    console.log('Inserting budget with data:', { 
      name, 
      amount, 
      icon: icon || '💰', 
      createdBy: createdBy || 'default-user' 
    });
    
    const result = await db.execute(
      sql`INSERT INTO budgets (name, amount, icon, "createdBy", "createdAt") 
          VALUES (${name}, ${amount}, ${icon || '💰'}, ${createdBy || 'default-user'}, NOW())
          RETURNING *`
    );
    
    console.log('Budget created successfully:', result.rows[0]);
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ 
      error: 'Failed to create budget',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 