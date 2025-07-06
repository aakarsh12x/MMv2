import { NextResponse } from 'next/server';
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

// Force dynamic rendering
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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy');
    
    if (!createdBy) {
      return NextResponse.json({ error: 'createdBy parameter is required' }, { status: 400 });
    }
    
    // Fetch all data for the user
    const [budgets, expenses, incomes] = await Promise.all([
      db.execute(sql`SELECT * FROM budgets WHERE "createdBy" = ${createdBy} ORDER BY "createdAt" DESC`),
      db.execute(sql`SELECT e.*, b.name as budget_name FROM expenses e LEFT JOIN budgets b ON e."budgetId" = b.id WHERE e."createdBy" = ${createdBy} ORDER BY e."createdAt" DESC`),
      db.execute(sql`SELECT * FROM incomes WHERE "createdBy" = ${createdBy} ORDER BY "createdAt" DESC`)
    ]);
    
    const exportData = {
      exportDate: new Date().toISOString(),
      user: createdBy,
      data: {
        budgets: budgets.rows,
        expenses: expenses.rows,
        incomes: incomes.rows
      }
    };
    
    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
} 