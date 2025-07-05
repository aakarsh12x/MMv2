// DRIZZLE SCHEMAS (COMMENTED OUT FOR FUTURE USE)
/*
import {
  integer,
  numeric,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const Budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: varchar("amount").notNull(),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
});

export const Incomes = pgTable("incomes", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: varchar("amount").notNull(),
  icon: varchar("icon"),
  createdBy: varchar("createdBy").notNull(),
});
export const Expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  amount: numeric("amount").notNull().default(0),
  budgetId: integer("budgetId").references(() => Budgets.id),
  createdAt: varchar("createdAt").notNull(),
});
*/

// MONGODB SCHEMAS - Server-side only
let Budget, Income, Expense;

// Only import mongoose on server-side
if (typeof window === 'undefined') {
  const mongoose = require('mongoose');

  // Budget Schema
  const budgetSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: '💰'
    },
    createdBy: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  // Income Schema
  const incomeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: '💵'
    },
    createdBy: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  });

  // Expense Schema
  const expenseSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      default: 0
    },
    budgetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget'
    },
    createdBy: {
      type: String,
      required: true
    },
    createdAt: {
      type: String,
      required: true
    }
  });

  // Create and export models
  Budget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);
  Income = mongoose.models.Income || mongoose.model('Income', incomeSchema);
  Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
}

// Export models (will be undefined on client-side)
export { Budget, Income, Expense };
