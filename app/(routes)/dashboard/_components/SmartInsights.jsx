"use client";
import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Target, Lightbulb, Brain, BarChart3 } from 'lucide-react';
import formatNumber from "@/utils";

// Simple fallback if aiAnalytics fails to load
const fallbackAiAnalytics = {
  getFinancialHealthScore: async (totalBudget, totalIncome, totalSpend) => {
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpend) / totalIncome) * 100 : 0;
    let score = 0;
    if (savingsRate >= 20) score = 85;
    else if (savingsRate >= 10) score = 70;
    else if (savingsRate >= 0) score = 50;
    else score = 20;
    
    return { 
      score, 
      status: score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Fair" : "Needs Improvement",
      color: score >= 80 ? "green" : score >= 60 ? "blue" : score >= 40 ? "yellow" : "red"
    };
  },
  getAdvancedFinancialAdvice: async (totalBudget, totalIncome, totalSpend) => {
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpend) / totalIncome) * 100 : 0;
    if (savingsRate >= 20) return "Excellent work! You're saving more than 20% of your income.";
    if (savingsRate >= 10) return "Good savings rate! Try to increase it to 20% by reducing non-essential expenses.";
    if (savingsRate >= 0) return "Your savings rate is below recommended levels. Focus on reducing expenses.";
    return "You're spending more than you earn. Focus on reducing expenses and consider additional income sources.";
  },
  getSmartRecommendations: async (totalBudget, totalIncome, totalSpend) => {
    const recommendations = [];
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpend) / totalIncome) * 100 : 0;
    
    if (savingsRate < 10) {
      recommendations.push({
        title: "Increase Savings Rate",
        description: "Aim to save at least 10-20% of your income.",
        priority: "medium"
      });
    }
    
    return recommendations;
  }
};

let aiAnalytics = fallbackAiAnalytics;

// Try to import the real aiAnalytics
try {
  const aiAnalyticsModule = await import('../../../utils/aiAnalytics');
  aiAnalytics = aiAnalyticsModule.default || aiAnalyticsModule;
} catch (error) {
  console.log('Using fallback aiAnalytics');
}

function SmartInsights({ budgetList, incomeList, totalBudget, totalIncome, totalSpend }) {
  const [activeTab, setActiveTab] = useState('insights');
  const [financialHealth, setFinancialHealth] = useState({ score: 0, status: "Unknown", color: "gray" });
  const [recommendations, setRecommendations] = useState([]);
  const [advice, setAdvice] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('SmartInsights useEffect triggered with:', { totalBudget, totalIncome, totalSpend });
    if (totalBudget > 0 || totalIncome > 0 || totalSpend > 0) {
      loadSmartInsights();
    } else {
      console.log('No data available for SmartInsights');
      setIsLoading(false);
    }
  }, [totalBudget, totalIncome, totalSpend]);

  const loadSmartInsights = async () => {
    console.log('Loading smart insights...');
    setIsLoading(true);
    try {
      // Get financial health score
      console.log('Getting financial health score...');
      const healthScore = await aiAnalytics.getFinancialHealthScore(totalBudget, totalIncome, totalSpend);
      console.log('Health score:', healthScore);
      setFinancialHealth(healthScore);

      // Get AI advice
      console.log('Getting AI advice...');
      const aiAdvice = await aiAnalytics.getAdvancedFinancialAdvice(totalBudget, totalIncome, totalSpend);
      console.log('AI advice:', aiAdvice);
      setAdvice(aiAdvice);

      // Get recommendations
      console.log('Getting recommendations...');
      const recs = await aiAnalytics.getSmartRecommendations(totalBudget, totalIncome, totalSpend);
      console.log('Recommendations:', recs);
      setRecommendations(recs);
    } catch (error) {
      console.error('Error loading smart insights:', error);
      // Use fallback advice
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpend) / totalIncome) * 100 : 0;
      if (savingsRate >= 20) {
        setAdvice("Excellent work! You're saving more than 20% of your income.");
      } else if (savingsRate >= 10) {
        setAdvice("Good savings rate! Try to increase it to 20% by reducing non-essential expenses.");
      } else if (savingsRate >= 0) {
        setAdvice("Your savings rate is below recommended levels. Focus on reducing expenses.");
      } else {
        setAdvice("You're spending more than you earn. Focus on reducing expenses and consider additional income sources.");
      }
    }
    setIsLoading(false);
  };

  const tabs = [
    { id: 'insights', label: 'AI Insights', icon: Brain },
    { id: 'health', label: 'Financial Health', icon: TrendingUp },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
  ];

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpend) / totalIncome) * 100 : 0;
  const budgetUsage = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-5 border-b">
        <div className="flex items-center mb-4">
          <Brain className="text-blue-600 mr-2" size={20} />
          <h2 className="text-lg font-bold">Smart Financial Insights</h2>
        </div>
        
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={16} className="mr-1" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-4 bg-gray-100 animate-pulse rounded"></div>
            <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4"></div>
            <div className="h-4 bg-gray-100 animate-pulse rounded w-1/2"></div>
          </div>
        ) : (
          <>
            {activeTab === 'insights' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">AI Financial Advice</h3>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    {advice || "Add some budgets and expenses to get personalized AI advice."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Savings Rate</span>
                      <TrendingUp className={`${savingsRate >= 20 ? 'text-green-500' : 'text-yellow-500'}`} size={16} />
                    </div>
                    <div className="text-2xl font-bold">{savingsRate.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {savingsRate >= 20 ? 'Excellent' : savingsRate >= 10 ? 'Good' : 'Needs Improvement'}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Budget Usage</span>
                      <BarChart3 className={`${budgetUsage <= 80 ? 'text-green-500' : budgetUsage <= 100 ? 'text-yellow-500' : 'text-red-500'}`} size={16} />
                    </div>
                    <div className="text-2xl font-bold">{budgetUsage.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {budgetUsage <= 80 ? 'Under Control' : budgetUsage <= 100 ? 'Close to Limit' : 'Over Budget'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'health' && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                    financialHealth.color === 'green' ? 'bg-green-100' :
                    financialHealth.color === 'blue' ? 'bg-blue-100' :
                    financialHealth.color === 'yellow' ? 'bg-yellow-100' :
                    financialHealth.color === 'red' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <span className={`text-2xl font-bold ${
                      financialHealth.color === 'green' ? 'text-green-600' :
                      financialHealth.color === 'blue' ? 'text-blue-600' :
                      financialHealth.color === 'yellow' ? 'text-yellow-600' :
                      financialHealth.color === 'red' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {financialHealth.score}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-1">Financial Health Score</h3>
                  <p className={`font-semibold ${
                    financialHealth.color === 'green' ? 'text-green-600' :
                    financialHealth.color === 'blue' ? 'text-blue-600' :
                    financialHealth.color === 'yellow' ? 'text-yellow-600' :
                    financialHealth.color === 'red' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {financialHealth.status}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Total Income</span>
                    <span className="font-semibold">₹{formatNumber(totalIncome)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Total Expenses</span>
                    <span className="font-semibold">₹{formatNumber(totalSpend)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Budget Allocated</span>
                    <span className="font-semibold">₹{formatNumber(totalBudget)}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-3">
                {recommendations.length > 0 ? (
                  recommendations.map((rec, index) => (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${
                      rec.priority === 'high' ? 'bg-red-50 border-red-400' :
                      rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                      'bg-blue-50 border-blue-400'
                    }`}>
                      <div className="flex items-start">
                        <AlertTriangle 
                          className={`mt-0.5 mr-2 ${
                            rec.priority === 'high' ? 'text-red-500' :
                            rec.priority === 'medium' ? 'text-yellow-500' :
                            'text-blue-500'
                          }`} 
                          size={16} 
                        />
                        <div>
                          <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                          <p className="text-sm text-gray-600">{rec.description}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Target className="mx-auto text-gray-400 mb-2" size={24} />
                    <p className="text-gray-500">No specific recommendations at the moment.</p>
                    <p className="text-gray-400 text-sm">Keep tracking your expenses for personalized advice!</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SmartInsights; 