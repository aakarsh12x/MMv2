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

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { name, amount, icon } = body;
    
    if (!name || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const result = await db.execute(
      sql`UPDATE budgets SET name = ${name}, amount = ${amount}, icon = ${icon || '💰'} WHERE id = ${id} RETURNING *`
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating budget:', error);
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const result = await db.execute(
      sql`DELETE FROM budgets WHERE id = ${id} RETURNING *`
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
  }
} 