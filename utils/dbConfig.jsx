// SUPABASE CONFIGURATION (COMMENTED OUT FOR FUTURE USE)
/*
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Database URL - fallback to environment variable with clear error message 
const DATABASE_URL = process.env.NEXT_PUBLIC_DATABASE_URL;

if (!DATABASE_URL) {
  console.error("ERROR: NEXT_PUBLIC_DATABASE_URL is not defined in environment variables");
  throw new Error("Database connection failed: Missing database URL");
}

// Create the database connection
let sql;
try {
  sql = neon(DATABASE_URL);
  console.log("Database connection initialized");
} catch (error) {
  console.error("Error initializing database connection:", error);
  throw new Error("Failed to initialize database connection");
}

// Export the drizzle instance with schema
export const db = drizzle(sql, { schema });

// Simple helper to check if the database is available
export const checkDatabaseConnection = async () => {
  try {
    await sql`SELECT 1`;
    return { connected: true };
  } catch (error) {
    console.error("Database connection test failed:", error);
    return { connected: false, error };
  }
};
*/

// MONGODB CONFIGURATION - Server-side only
let db = null;

// Only initialize MongoDB on server-side
if (typeof window === 'undefined') {
  const mongoose = require('mongoose');

  // MongoDB connection URL
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("ERROR: MONGODB_URI is not defined in environment variables");
    throw new Error("Database connection failed: Missing MongoDB URI");
  }

  // Create the database connection
  try {
    if (mongoose.connection.readyState === 0) {
      mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB connection initialized");
    }
    db = mongoose.connection;
  } catch (error) {
    console.error("Error initializing MongoDB connection:", error);
    throw new Error("Failed to initialize MongoDB connection");
  }
}

// Simple helper to check if the database is available
export const checkDatabaseConnection = async () => {
  if (typeof window !== 'undefined') {
    return { connected: false, error: "Client-side database check not allowed" };
  }
  
  try {
    if (db && db.readyState === 1) {
      return { connected: true };
    } else {
      return { connected: false, error: "MongoDB not connected" };
    }
  } catch (error) {
    console.error("MongoDB connection test failed:", error);
    return { connected: false, error };
  }
};

// Export the mongoose connection (null on client-side)
export { db };
