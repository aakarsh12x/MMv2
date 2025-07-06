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

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Income ID is required' }, { status: 400 });
    }
    
    const income = await db.execute(
      sql`SELECT * FROM incomes WHERE id = ${id}`
    );
    
    if (!income.rows.length) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 });
    }
    
    return NextResponse.json(income.rows[0]);
  } catch (error) {
    console.error('Error fetching income:', error);
    return NextResponse.json({ error: 'Failed to fetch income', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ error: 'Income ID is required' }, { status: 400 });
    }
    
    console.log(`Attempting to delete income with ID: ${id}`);
    
    const result = await db.execute(
      sql`DELETE FROM incomes WHERE id = ${id} RETURNING *`
    );
    
    if (!result.rows.length) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 });
    }
    
    console.log('Income deleted successfully:', result.rows[0]);
    return NextResponse.json({ message: 'Income deleted successfully', deletedIncome: result.rows[0] });
  } catch (error) {
    console.error('Error deleting income:', error);
    return NextResponse.json({ error: 'Failed to delete income', details: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Income ID is required' }, { status: 400 });
    }
    
    const { name, amount, frequency, date, description, icon } = body;
    
    if (!name && !amount && !frequency && !date && !description && !icon) {
      return NextResponse.json({ error: 'At least one field to update is required' }, { status: 400 });
    }
    
    // Build the SET clause dynamically based on provided fields
    let setClause = [];
    let parameters = [];
    
    if (name) {
      setClause.push(`name = $${parameters.length + 1}`);
      parameters.push(name);
    }
    
    if (amount) {
      setClause.push(`amount = $${parameters.length + 1}`);
      parameters.push(amount);
    }
    
    if (frequency) {
      setClause.push(`frequency = $${parameters.length + 1}`);
      parameters.push(frequency);
    }
    
    if (date) {
      setClause.push(`date = $${parameters.length + 1}`);
      parameters.push(date);
    }
    
    if (description) {
      setClause.push(`description = $${parameters.length + 1}`);
      parameters.push(description);
    }
    
    if (icon) {
      setClause.push(`icon = $${parameters.length + 1}`);
      parameters.push(icon);
    }
    
    parameters.push(id);
    
    const result = await db.execute(
      sql`UPDATE incomes SET ${sql.raw(setClause.join(', '))} WHERE id = $${parameters.length} RETURNING *`,
      ...parameters
    );
    
    if (!result.rows.length) {
      return NextResponse.json({ error: 'Income not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating income:', error);
    return NextResponse.json({ error: 'Failed to update income', details: error.message }, { status: 500 });
  }
} 