import formatNumber from "@/utils";
import getFinancialAdvice from "@/utils/getFinancialAdvice";
import {
  PiggyBank,
  ReceiptText,
  Wallet,
  Sparkles,
  CircleDollarSign,
  ArrowTrendingUp,
  TrendingDown,
  BarChartHorizontal
} from "lucide-react";
import React, { useEffect, useState } from "react";

function CardInfo({ budgetList, incomeList, isLoading }) {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [financialAdvice, setFinancialAdvice] = useState("");
  const [adviceLoading, setAdviceLoading] = useState(false);

  useEffect(() => {
    if (budgetList?.length > 0 || incomeList?.length > 0) {
      calculateCardInfo();
    }
  }, [budgetList, incomeList]);

  useEffect(() => {
    if (totalBudget > 0 || totalIncome > 0 || totalSpend > 0) {
      const fetchFinancialAdvice = async () => {
        setAdviceLoading(true);
        try {
          const advice = await getFinancialAdvice(
            budgetList || [],
            incomeList || [],
            [] // expenseData - we'll add this later
          );
          setFinancialAdvice(advice?.advice || "No financial advice available.");
        } catch (error) {
          console.error("Error fetching financial advice:", error);
          setFinancialAdvice("Unable to generate financial advice at the moment.");
        } finally {
          setAdviceLoading(false);
        }
      };

      fetchFinancialAdvice();
    }
  }, [totalBudget, totalIncome, totalSpend, budgetList, incomeList]);

  const calculateCardInfo = () => {
    let totalBudget_ = 0;
    let totalSpend_ = 0;
    let totalIncome_ = 0;

    if (budgetList?.length > 0) {
      budgetList.forEach((element) => {
        // Ensure proper number conversion
        const budgetAmount = parseFloat(element.amount) || 0;
        const budgetSpend = parseFloat(element.totalSpend) || 0;
        
        totalBudget_ = totalBudget_ + budgetAmount;
        totalSpend_ = totalSpend_ + budgetSpend;
      });
    }

    if (incomeList?.length > 0) {
      incomeList.forEach((element) => {
        // Ensure proper number conversion
        const incomeAmount = parseFloat(element.totalAmount) || 0;
        totalIncome_ = totalIncome_ + incomeAmount;
      });
    }

    setTotalIncome(totalIncome_);
    setTotalBudget(totalBudget_);
    setTotalSpend(totalSpend_);
  };

  const getRemainingBudget = () => {
    const budget = typeof totalBudget === 'number' ? totalBudget : parseFloat(totalBudget || 0);
    const spent = typeof totalSpend === 'number' ? totalSpend : parseFloat(totalSpend || 0);
    
    return isNaN(budget) || isNaN(spent) ? 0 : budget - spent;
  };

  const getSavingsRate = () => {
    const income = typeof totalIncome === 'number' ? totalIncome : parseFloat(totalIncome || 0);
    const spent = typeof totalSpend === 'number' ? totalSpend : parseFloat(totalSpend || 0);
    
    if (isNaN(income) || income <= 0) return 0;
    return ((income - spent) / income) * 100;
  };

  const formatPercentage = (value) => {
    if (typeof value !== 'number' || isNaN(value)) return "0";
    return Math.min(100, Math.max(0, value)).toFixed(0);
  };

  const calculateBudgetPercentage = () => {
    if (!totalBudget || totalBudget <= 0) return 0;
    const percentage = (totalSpend / totalBudget) * 100;
    return isNaN(percentage) ? 0 : Math.min(100, percentage);
  };

  const calculateRemainingPercentage = () => {
    const remaining = getRemainingBudget();
    if (!totalBudget || totalBudget <= 0) return 0;
    const percentage = (remaining / totalBudget) * 100;
    return isNaN(percentage) ? 0 : Math.min(100, Math.abs(percentage));
  };

  return (
    <div>
      <div className="mb-6 bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 flex items-center border-b">
          <Sparkles className="text-blue-600 mr-2" />
          <h2 className="text-lg font-bold">Financial Insights</h2>
        </div>
        
        <div className="p-5">
          {isLoading || adviceLoading ? (
            <div className="h-12 bg-gray-100 animate-pulse rounded-lg"></div>
          ) : (
            <p className="text-gray-700">{financialAdvice || "No financial data available yet. Add budgets and expenses to get personalized advice."}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <div className="h-5 w-24 bg-gray-100 animate-pulse rounded-md"></div>
              <div className="h-8 w-32 bg-gray-100 animate-pulse rounded-md"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Total Budget</span>
                <PiggyBank className="text-blue-600" size={20} />
              </div>
              <h3 className="text-2xl font-bold">₹{formatNumber(totalBudget)}</h3>
              <div className="mt-2 text-xs text-gray-500">
                {budgetList?.length > 0 ? `Across ${budgetList.length} budget categories` : "No budgets created"}
              </div>
            </>
          )}
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <div className="h-5 w-24 bg-gray-100 animate-pulse rounded-md"></div>
              <div className="h-8 w-32 bg-gray-100 animate-pulse rounded-md"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Total Spent</span>
                <ReceiptText className="text-red-500" size={20} />
              </div>
              <h3 className="text-2xl font-bold">₹{formatNumber(totalSpend)}</h3>
              <div className="mt-2 text-xs text-gray-500">
                {totalSpend > 0 && totalBudget > 0
                  ? `${formatPercentage(calculateBudgetPercentage())}% of total budget` 
                  : "No expenses recorded"}
              </div>
            </>
          )}
        </div>

        {/* Remaining Budget */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <div className="h-5 w-24 bg-gray-100 animate-pulse rounded-md"></div>
              <div className="h-8 w-32 bg-gray-100 animate-pulse rounded-md"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Remaining Budget</span>
                <Wallet className={`${getRemainingBudget() >= 0 ? 'text-green-500' : 'text-red-500'}`} size={20} />
              </div>
              <h3 className="text-2xl font-bold">₹{formatNumber(getRemainingBudget())}</h3>
              <div className="mt-2 text-xs text-gray-500">
                {getRemainingBudget() >= 0 && totalBudget > 0
                  ? `${formatPercentage(calculateRemainingPercentage())}% of budget left` 
                  : totalBudget > 0
                    ? `${formatPercentage(calculateRemainingPercentage())}% over budget`
                    : "Budget not set"}
              </div>
            </>
          )}
        </div>

        {/* Total Income */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          {isLoading ? (
            <div className="flex flex-col gap-2">
              <div className="h-5 w-24 bg-gray-100 animate-pulse rounded-md"></div>
              <div className="h-8 w-32 bg-gray-100 animate-pulse rounded-md"></div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Total Income</span>
                <CircleDollarSign className="text-green-500" size={20} />
              </div>
              <h3 className="text-2xl font-bold">₹{formatNumber(totalIncome)}</h3>
              <div className="mt-2 text-xs text-gray-500">
                {getSavingsRate() > 0 
                  ? `Saving rate: ${formatPercentage(getSavingsRate())}%` 
                  : getSavingsRate() < 0 
                    ? "Spending exceeds income" 
                    : "No income recorded"}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CardInfo;
