"use client";
import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertCircle, Lightbulb, Tag } from 'lucide-react';
import aiAnalytics from '@/utils/aiAnalytics';

function SmartExpenseAdd({ expenseName, amount, onCategoryChange }) {
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (expenseName && amount && amount > 0) {
      const timer = setTimeout(() => {
        analyzeExpense();
      }, 1000); // Debounce API calls

      return () => clearTimeout(timer);
    }
  }, [expenseName, amount]);

  const analyzeExpense = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await aiAnalytics.categorizeExpense(expenseName, amount);
      setAiAnalysis(analysis);
      
      // Pass category to parent component
      if (onCategoryChange && analysis.category) {
        onCategoryChange(analysis.category);
      }
    } catch (error) {
      console.error('Error analyzing expense:', error);
      setAiAnalysis({
        category: "Other",
        confidence: 0.5,
        suggestion: "Unable to analyze expense automatically."
      });
    }
    setIsAnalyzing(false);
  };

  if (!expenseName || !amount) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
      <div className="flex items-center mb-3">
        <Sparkles className="text-blue-600 mr-2" size={18} />
        <h3 className="font-semibold text-gray-900">AI Analysis</h3>
      </div>

      {isAnalyzing ? (
        <div className="space-y-3">
          <div className="h-4 bg-gray-100 animate-pulse rounded"></div>
          <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4"></div>
        </div>
      ) : aiAnalysis ? (
        <div className="space-y-4">
          {/* Category Suggestion */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Tag className="text-blue-600 mr-2" size={16} />
                <span className="font-medium text-blue-900">Suggested Category</span>
              </div>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {Math.round(aiAnalysis.confidence * 100)}% confident
              </span>
            </div>
            <p className="text-blue-800 font-semibold">{aiAnalysis.category}</p>
          </div>

          {/* AI Suggestion */}
          {aiAnalysis.suggestion && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-start">
                <Lightbulb className="text-green-600 mr-2 mt-0.5" size={16} />
                <div>
                  <span className="font-medium text-green-900 block mb-1">Smart Tip</span>
                  <p className="text-green-800 text-sm">{aiAnalysis.suggestion}</p>
                </div>
              </div>
            </div>
          )}

          {/* Expense Priority */}
          {amount > 1000 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start">
                <AlertCircle className="text-yellow-600 mr-2 mt-0.5" size={16} />
                <div>
                  <span className="font-medium text-yellow-900 block mb-1">Priority Assessment</span>
                  <p className="text-yellow-800 text-sm">
                    {amount > 5000 
                      ? "High amount expense - Consider if this is essential or can be postponed."
                      : "Medium expense - Review if this fits within your budget goals."
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          <Sparkles className="mx-auto mb-2 text-gray-400" size={20} />
          <p className="text-sm">Add expense details to get AI insights</p>
        </div>
      )}
    </div>
  );
}

export default SmartExpenseAdd; 