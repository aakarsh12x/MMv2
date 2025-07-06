import { NextResponse } from 'next/server';
import { connectToMongoDB, COLLECTIONS } from '@/utils/mongoSchemas';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { db } = await connectToMongoDB();
    const { searchParams } = new URL(request.url);
    const createdBy = searchParams.get('createdBy');
    
    if (!createdBy) {
      return NextResponse.json({ error: 'createdBy parameter is required' }, { status: 400 });
    }
    
    // Fetch all data for the user
    const [budgets, expenses, incomes] = await Promise.all([
      db.collection(COLLECTIONS.BUDGETS).find({ createdBy }).sort({ createdAt: -1 }).toArray(),
      db.collection(COLLECTIONS.EXPENSES).find({ createdBy }).sort({ createdAt: -1 }).toArray(),
      db.collection(COLLECTIONS.INCOMES).find({ createdBy }).sort({ createdAt: -1 }).toArray()
    ]);
    
    // Enrich expenses with budget details
    const enrichedExpenses = await Promise.all(
      expenses.map(async (expense) => {
        if (expense.budgetId) {
          const budget = await db.collection(COLLECTIONS.BUDGETS).findOne({ _id: expense.budgetId });
          return {
            ...expense,
            budget_name: budget ? budget.name : null
          };
        }
        return expense;
      })
    );
    
    const exportData = {
      exportDate: new Date().toISOString(),
      user: createdBy,
      data: {
        budgets,
        expenses: enrichedExpenses,
        incomes
      }
    };
    
    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ error: 'Failed to export data' }, { status: 500 });
  }
} 