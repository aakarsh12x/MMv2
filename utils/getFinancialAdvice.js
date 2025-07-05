// utils/getFinancialAdvice.js
import { GoogleGenerativeAI } from "@google/generative-ai";

// Access the API key securely from environment variables
const apiKey = process.env.NEXT_PUBLIC_GEMENI_KEY;

if (!apiKey) {
  console.error("Error: GEMINI_KEY is not defined in the environment variables.");
  throw new Error("API key is missing. Check your .env.local configuration.");
}

// Initialize the Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

// Load the model once
let model;
try {
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
} catch (error) {
  console.error("Error initializing generative model:", error);
  throw new Error("Failed to initialize the generative AI model.");
}

// Function to generate personalized financial advice
const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  try {
    // Calculate some useful metrics
    const budgetUsedPercentage = totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalSpend) / totalIncome) * 100 : 0;
    const isOverBudget = totalSpend > totalBudget;
    const isSpendingMoreThanEarning = totalSpend > totalIncome;
    
    const userPrompt = `
      You are a skilled personal financial advisor. Analyze this financial data and provide personalized actionable advice:
      
      FINANCIAL DATA:
      - Total Budget: ${totalBudget.toFixed(2)} Rupees
      - Total Expenses: ${totalSpend.toFixed(2)} Rupees (${budgetUsedPercentage.toFixed(1)}% of budget)
      - Total Income: ${totalIncome.toFixed(2)} Rupees
      - Current Savings Rate: ${savingsRate.toFixed(1)}%
      - Budget Status: ${isOverBudget ? 'Over budget by ' + (totalSpend - totalBudget).toFixed(2) + ' Rupees' : 'Under budget by ' + (totalBudget - totalSpend).toFixed(2) + ' Rupees'}
      
      INSTRUCTIONS:
      1. Provide practical, personalized financial advice based on this data
      2. Consider budget allocation, saving opportunities, and spending patterns
      3. If they're over budget or spending more than income, suggest specific strategies
      4. If they're saving well, provide optimization tips
      5. Keep your response concise but specific (2-3 sentences maximum)
      6. Use a friendly, encouraging tone
      7. Offer one specific, actionable tip they can implement immediately
      
      Your advice:
    `;

    // Send the prompt to the Gemini API using generateContent
    const result = await model.generateContent(userPrompt);
    const advice = result.response.text();

    console.log("Financial advice generated:", advice);
    return advice;
  } catch (error) {
    console.error("Error fetching financial advice:", error);
    return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
  }
};

export default getFinancialAdvice;
