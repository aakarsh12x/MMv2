import { MongoClient, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';

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

// Mongoose Schema Definitions
const budgetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
  icon: { type: String, default: '💰' },
  createdBy: { type: String, default: 'default-user' },
  createdAt: { type: Date, default: Date.now }
});

const incomeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
  frequency: { type: String, default: 'monthly' },
  date: { type: String },
  description: { type: String, default: '' },
  icon: { type: String, default: '💵' },
  createdBy: { type: String, default: 'default-user' },
  createdAt: { type: Date, default: Date.now }
});

const expenseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  budgetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Budget' },
  createdBy: { type: String, default: 'default-user' },
  createdAt: { type: Date, default: Date.now }
});

// Export Mongoose models
export const Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);
export const Income = mongoose.models.Income || mongoose.model('Income', incomeSchema);
export const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);

// Budget schema definition (for documentation, not enforced by MongoDB)
export const budgetSchemaDefinition = {
  name: String,
  amount: String,
  icon: String,
  createdBy: String,
  createdAt: Date
};

// Income schema definition (for documentation, not enforced by MongoDB)
export const incomeSchemaDefinition = {
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
export const expenseSchemaDefinition = {
  name: String,
  amount: Number,
  budgetId: String,
  createdBy: String,
  createdAt: Date
}; 