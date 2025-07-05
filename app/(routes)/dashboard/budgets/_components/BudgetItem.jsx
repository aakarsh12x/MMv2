import Link from "next/link";
import React from "react";

function BudgetItem({ budget }) {
  const calculateProgressPerc = () => {
    // Make sure both values are properly converted to numbers
    const amount = typeof budget.amount === 'number' 
      ? budget.amount 
      : parseFloat(budget.amount || 0);
      
    const totalSpend = typeof budget.totalSpend === 'number'
      ? budget.totalSpend
      : parseFloat(budget.totalSpend || 0);
    
    // Handle potential division by zero or NaN
    if (!amount || isNaN(amount) || amount === 0) return 0;
    
    const perc = (totalSpend / amount) * 100;
    // Ensure the result is a valid number before calling toFixed
    return isNaN(perc) ? 0 : (perc > 100 ? 100 : perc).toFixed(2);
  };
  
  // Safely convert budget values to numbers
  const getAmount = () => {
    const amount = typeof budget.amount === 'number' 
      ? budget.amount 
      : parseFloat(budget.amount || 0);
    return isNaN(amount) ? 0 : amount;
  };
  
  const getTotalSpend = () => {
    const spend = typeof budget.totalSpend === 'number'
      ? budget.totalSpend
      : parseFloat(budget.totalSpend || 0);
    return isNaN(spend) ? 0 : spend;
  };
  
  const getRemaining = () => {
    return Math.max(0, getAmount() - getTotalSpend());
  };
  
  return (
    <Link href={"/dashboard/expenses/" + budget?.id}>
      <div
        className="p-5 border rounded-2xl
    hover:shadow-md cursor-pointer h-[170px]"
      >
        <div className="flex gap-2 items-center justify-between">
          <div className="flex gap-2 items-center">
            <h2
              className="text-2xl p-3 px-4
              bg-slate-100 rounded-full 
              "
            >
              {budget?.icon || "💰"}
            </h2>
            <div>
              <h2 className="font-bold">{budget.name || "Budget"}</h2>
              <h2 className="text-sm text-gray-500">{budget.totalItem || 0} Item{budget.totalItem !== 1 && "s"}</h2>
            </div>
          </div>
          <h2 className="font-bold text-primary text-lg">₹{getAmount().toFixed(2)}</h2>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs text-slate-400">
              ₹{getTotalSpend().toFixed(2)} Spent
            </h2>
            <h2 className="text-xs text-slate-400">
              ₹{getRemaining().toFixed(2)} Remaining
            </h2>
          </div>
          <div
            className="w-full
              bg-slate-300 h-2 rounded-full"
          >
            <div
              className="
              bg-primary h-2 rounded-full"
              style={{
                width: `${calculateProgressPerc()}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default BudgetItem;
