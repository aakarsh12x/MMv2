import { MongoClient, ServerApiVersion } from 'mongodb';

// MongoDB connection
let client = null;
let db = null;

// Connect to MongoDB
export async function connectToMongoDB() {
  try {
    if (!client) {
      client = new MongoClient(process.env.MONGODB_URI, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
      
      await client.connect();
      console.log("Connected to MongoDB");
      
      // Use the "moneymap" database
      db = client.db("moneymap");
    }
    
    return { client, db };
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

// Collection names
export const COLLECTIONS = {
  BUDGETS: "budgets",
  INCOMES: "incomes",
  EXPENSES: "expenses"
};

// Budget schema definition (for documentation, not enforced by MongoDB)
export const budgetSchema = {
  name: String,
  amount: String,
  icon: String,
  createdBy: String,
  createdAt: Date
};

// Income schema definition (for documentation, not enforced by MongoDB)
export const incomeSchema = {
  name: String,
  amount: String,
  frequency: String,
  date: String,
  description: String,
  icon: String,
  createdBy: String,
  createdAt: Date
};

// Expense schema definition (for documentation, not enforced by MongoDB)
export const expenseSchema = {
  name: String,
  amount: Number,
  budgetId: String,
  createdBy: String,
  createdAt: Date
}; 