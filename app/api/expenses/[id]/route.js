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

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const result = await db.execute(
      sql`DELETE FROM expenses WHERE id = ${id} RETURNING *`
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
} 