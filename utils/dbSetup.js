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

export async function setupDatabase() {
  try {
    console.log("Setting up database tables...");
    
    // Create budgets table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS budgets (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        amount VARCHAR NOT NULL,
        icon VARCHAR,
        "createdBy" VARCHAR NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create incomes table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS incomes (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        amount VARCHAR NOT NULL,
        frequency VARCHAR DEFAULT 'monthly',
        date VARCHAR,
        description TEXT,
        icon VARCHAR,
        "createdBy" VARCHAR NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create expenses table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        amount NUMERIC NOT NULL DEFAULT 0,
        "budgetId" INTEGER REFERENCES budgets(id),
        "createdBy" VARCHAR NOT NULL,
        "createdAt" TIMESTAMP DEFAULT NOW()
      )
    `);
    
    console.log("Database tables created successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error setting up database:", error);
    return { success: false, error: error.message };
  }
} 