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

export async function POST(request) {
  try {
    const body = await request.json();
    const { budgets, expenses, incomes, createdBy } = body;
    
    if (!createdBy) {
      return NextResponse.json({ error: 'createdBy parameter is required' }, { status: 400 });
    }
    
    const results = {
      budgets: [],
      expenses: [],
      incomes: []
    };
    
    // Import budgets
    if (budgets && budgets.length > 0) {
      for (const budget of budgets) {
        const result = await db.execute(
          sql`INSERT INTO budgets (name, amount, icon, "createdBy", "createdAt") 
              VALUES (${budget.name}, ${budget.amount}, ${budget.icon || '💰'}, ${createdBy}, NOW())
              RETURNING *`
        );
        results.budgets.push(result.rows[0]);
      }
    }
    
    // Import incomes
    if (incomes && incomes.length > 0) {
      for (const income of incomes) {
        const result = await db.execute(
          sql`INSERT INTO incomes (name, amount, icon, "createdBy", "createdAt") 
              VALUES (${income.name}, ${income.amount}, ${income.icon || '💵'}, ${createdBy}, NOW())
              RETURNING *`
        );
        results.incomes.push(result.rows[0]);
      }
    }
    
    // Import expenses
    if (expenses && expenses.length > 0) {
      for (const expense of expenses) {
        const result = await db.execute(
          sql`INSERT INTO expenses (name, amount, "budgetId", "createdBy", "createdAt") 
              VALUES (${expense.name}, ${expense.amount}, ${expense.budgetId || null}, ${createdBy}, NOW())
              RETURNING *`
        );
        results.expenses.push(result.rows[0]);
      }
    }
    
    return NextResponse.json({
      message: 'Data imported successfully',
      results
    }, { status: 201 });
  } catch (error) {
    console.error('Error importing data:', error);
    return NextResponse.json({ error: 'Failed to import data' }, { status: 500 });
  }
} 