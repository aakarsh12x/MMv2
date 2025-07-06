// utils/getFinancialAdvice.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Get the API key from environment variables
const apiKey = process.env.GEMINI_KEY;

// Initialize the Generative AI client
let genAI = null;

if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.warn("GEMINI_KEY not set - financial advice feature will be disabled");
}

export async function getFinancialAdvice(budgetData, incomeData, expenseData) {
  try {
    // If no API key, return a default message
    if (!genAI) {
      return {
        advice: "Financial advice feature is currently unavailable. Please check your API configuration.",
        tips: [
          "Track your expenses regularly",
          "Set realistic budget goals",
          "Save at least 20% of your income",
          "Review your spending habits monthly"
        ]
      };
    }

    // Create a prompt for financial advice
    const prompt = `
    Based on the following financial data, provide personalized financial advice and tips:
    
    Budgets: ${JSON.stringify(budgetData)}
    Incomes: ${JSON.stringify(incomeData)}
    Expenses: ${JSON.stringify(expenseData)}
    
    Please provide:
    1. 3-5 specific financial tips
    2. Areas for improvement
    3. Savings recommendations
    4. Budget optimization suggestions
    
    Format the response as JSON with 'advice' and 'tips' fields.
    `;

    // Generate content using the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse as JSON, fallback to text if it's not valid JSON
    try {
      return JSON.parse(text);
    } catch (e) {
      return {
        advice: text,
        tips: [
          "Track your expenses regularly",
          "Set realistic budget goals",
          "Save at least 20% of your income"
        ]
      };
    }
  } catch (error) {
    console.error("Error getting financial advice:", error);
    return {
      advice: "Unable to generate financial advice at this time.",
      tips: [
        "Track your expenses regularly",
        "Set realistic budget goals",
        "Save at least 20% of your income",
        "Review your spending habits monthly"
      ]
    };
  }
}

// Add default export
export default getFinancialAdvice;
