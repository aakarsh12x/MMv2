// AI Analytics for Smart Financial Insights
const aiAnalytics = {
  // Calculate financial health score
  getFinancialHealthScore: async (totalBudget, totalIncome, totalSpend) => {
    try {
      // Calculate basic metrics
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpend) / totalIncome) * 100 : 0;
      const budgetUsage = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;
      const incomeToExpenseRatio = totalSpend > 0 ? totalIncome / totalSpend : 0;

      // Calculate health score (0-100)
      let score = 0;
      
      // Savings rate contribution (40% weight)
      if (savingsRate >= 20) score += 40;
      else if (savingsRate >= 10) score += 30;
      else if (savingsRate >= 5) score += 20;
      else if (savingsRate >= 0) score += 10;

      // Budget usage contribution (30% weight)
      if (budgetUsage <= 80) score += 30;
      else if (budgetUsage <= 100) score += 20;
      else if (budgetUsage <= 120) score += 10;

      // Income to expense ratio contribution (30% weight)
      if (incomeToExpenseRatio >= 1.5) score += 30;
      else if (incomeToExpenseRatio >= 1.2) score += 20;
      else if (incomeToExpenseRatio >= 1.0) score += 10;

      // Determine status and color
      let status, color;
      if (score >= 80) {
        status = "Excellent";
        color = "green";
      } else if (score >= 60) {
        status = "Good";
        color = "blue";
      } else if (score >= 40) {
        status = "Fair";
        color = "yellow";
      } else {
        status = "Needs Improvement";
        color = "red";
      }

      return { score, status, color };
    } catch (error) {
      console.error('Error calculating financial health score:', error);
      return { score: 0, status: "Unknown", color: "gray" };
    }
  },

  // Get AI financial advice
  getAdvancedFinancialAdvice: async (totalBudget, totalIncome, totalSpend) => {
    try {
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpend) / totalIncome) * 100 : 0;
      const budgetUsage = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;

      let advice = "";

      if (totalIncome === 0 && totalSpend === 0) {
        advice = "Welcome to MoneyMap! Start by adding your income sources and creating budgets to get personalized financial advice.";
      } else if (savingsRate >= 20) {
        advice = "Excellent work! You're saving more than 20% of your income. Consider investing your savings in diversified portfolios or emergency funds.";
      } else if (savingsRate >= 10) {
        advice = "Good savings rate! Try to increase it to 20% by reducing non-essential expenses. Consider setting up automatic savings transfers.";
      } else if (savingsRate >= 0) {
        advice = "Your savings rate is below recommended levels. Focus on reducing expenses and increasing income. Start with small, achievable goals.";
      } else {
        advice = "You're spending more than you earn. This is unsustainable. Focus on reducing expenses and consider additional income sources.";
      }

      if (budgetUsage > 100) {
        advice += " You're currently over budget. Review your spending categories and identify areas to cut back.";
      } else if (budgetUsage > 80) {
        advice += " You're close to your budget limit. Monitor your spending closely this month.";
      }

      return advice;
    } catch (error) {
      console.error('Error getting AI advice:', error);
      return "Unable to generate financial advice at the moment. Please try again later.";
    }
  },

  // Get smart recommendations
  getSmartRecommendations: async (totalBudget, totalIncome, totalSpend) => {
    try {
      const recommendations = [];
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpend) / totalIncome) * 100 : 0;
      const budgetUsage = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;

      // High priority recommendations
      if (savingsRate < 0) {
        recommendations.push({
          title: "Emergency: Reduce Expenses",
          description: "You're spending more than you earn. Immediately cut non-essential expenses and find additional income sources.",
          priority: "high"
        });
      }

      if (budgetUsage > 120) {
        recommendations.push({
          title: "Over Budget Alert",
          description: "You're significantly over budget. Review your spending patterns and adjust your budget categories.",
          priority: "high"
        });
      }

      // Medium priority recommendations
      if (savingsRate < 10) {
        recommendations.push({
          title: "Increase Savings Rate",
          description: "Aim to save at least 10-20% of your income. Start with small, consistent amounts.",
          priority: "medium"
        });
      }

      if (budgetUsage > 80 && budgetUsage <= 100) {
        recommendations.push({
          title: "Monitor Budget Closely",
          description: "You're approaching your budget limit. Track your spending daily to avoid overspending.",
          priority: "medium"
        });
      }

      // Low priority recommendations
      if (totalIncome > 0 && totalSpend === 0) {
        recommendations.push({
          title: "Start Tracking Expenses",
          description: "Great! You have income set up. Now start tracking your expenses to get better insights.",
          priority: "low"
        });
      }

      if (totalBudget === 0 && totalIncome > 0) {
        recommendations.push({
          title: "Create Budget Categories",
          description: "Set up budget categories to better manage your spending and achieve your financial goals.",
          priority: "low"
        });
      }

      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  },

  // Get spending insights
  getSpendingInsights: async (expenses) => {
    try {
      if (!expenses || expenses.length === 0) {
        return "No spending data available. Start tracking your expenses to get insights.";
      }

      // Calculate spending by category
      const categorySpending = {};
      expenses.forEach(expense => {
        const category = expense.budgetId || 'Uncategorized';
        categorySpending[category] = (categorySpending[category] || 0) + expense.amount;
      });

      // Find highest spending category
      const highestCategory = Object.entries(categorySpending)
        .sort(([,a], [,b]) => b - a)[0];

      return `Your highest spending category is ${highestCategory[0]} with ₹${highestCategory[1].toLocaleString()}. Consider reviewing this area for potential savings.`;
    } catch (error) {
      console.error('Error getting spending insights:', error);
      return "Unable to analyze spending patterns at the moment.";
    }
  }
};

export default aiAnalytics; 