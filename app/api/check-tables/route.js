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

export async function GET() {
  try {
    console.log("Checking database tables...");
    
    // Check if tables exist
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const tableResults = {};
    
    // For each table, get its columns
    for (const table of tables.rows) {
      const tableName = table.table_name;
      const columns = await db.execute(sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = ${tableName}
      `);
      
      tableResults[tableName] = columns.rows;
    }
    
    // Check if we need to drop and recreate the incomes table
    if (tableResults.incomes) {
      const hasFrequency = tableResults.incomes.some(col => col.column_name === 'frequency');
      const hasDate = tableResults.incomes.some(col => col.column_name === 'date');
      const hasDescription = tableResults.incomes.some(col => col.column_name === 'description');
      
      if (!hasFrequency || !hasDate || !hasDescription) {
        console.log("Incomes table is missing required columns, dropping and recreating...");
        
        // Drop the incomes table
        await db.execute(sql`DROP TABLE IF EXISTS incomes`);
        
        // Recreate the incomes table with all required columns
        await db.execute(sql`
          CREATE TABLE incomes (
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
        
        // Get updated columns
        const updatedColumns = await db.execute(sql`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_schema = 'public' AND table_name = 'incomes'
        `);
        
        tableResults.incomes = updatedColumns.rows;
      }
    }
    
    return NextResponse.json({
      tables: tableResults,
      message: "Database tables checked successfully"
    });
  } catch (error) {
    console.error("Error checking database tables:", error);
    return NextResponse.json({ 
      error: "Failed to check database tables", 
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 