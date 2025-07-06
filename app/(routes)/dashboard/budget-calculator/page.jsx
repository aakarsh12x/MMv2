"use client";
import { useState } from 'react';
import { Calculator, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BudgetCalculator() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState({
    housing: '',
    food: '',
    transport: '',
    utilities: '',
    entertainment: '',
    healthcare: '',
    savings: '',
    other: ''
  });
  const [results, setResults] = useState(null);

  const handleExpenseChange = (category, value) => {
    setExpenses(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const calculateBudget = () => {
    const monthlyIncome = parseFloat(income) || 0;
    const totalExpenses = Object.values(expenses).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
    const remaining = monthlyIncome - totalExpenses;
    const savingsRate = monthlyIncome > 0 ? (parseFloat(expenses.savings) / monthlyIncome) * 100 : 0;

    setResults({
      monthlyIncome,
      totalExpenses,
      remaining,
      savingsRate,
      isHealthy: remaining >= 0 && savingsRate >= 20
    });
  };

  const getRecommendations = () => {
    if (!results) return [];
    
    const recommendations = [];
    
    if (results.remaining < 0) {
      recommendations.push("Your expenses exceed your income. Consider reducing non-essential expenses.");
    }
    
    if (results.savingsRate < 20) {
      recommendations.push("Aim to save at least 20% of your income for financial security.");
    }
    
    if (parseFloat(expenses.housing) / results.monthlyIncome > 0.3) {
      recommendations.push("Housing costs should ideally be less than 30% of your income.");
    }
    
    if (parseFloat(expenses.food) / results.monthlyIncome > 0.15) {
      recommendations.push("Consider ways to reduce food expenses while maintaining nutrition.");
    }
    
    return recommendations;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Budget Calculator</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Income & Expenses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="income">Monthly Income (₹)</Label>
              <Input
                id="income"
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Enter your monthly income"
              />
            </div>

            <div className="space-y-3">
              <Label>Monthly Expenses</Label>
              
              <div>
                <Label htmlFor="housing">Housing (₹)</Label>
                <Input
                  id="housing"
                  type="number"
                  value={expenses.housing}
                  onChange={(e) => handleExpenseChange('housing', e.target.value)}
                  placeholder="Rent, mortgage, etc."
                />
              </div>

              <div>
                <Label htmlFor="food">Food & Dining (₹)</Label>
                <Input
                  id="food"
                  type="number"
                  value={expenses.food}
                  onChange={(e) => handleExpenseChange('food', e.target.value)}
                  placeholder="Groceries, restaurants, etc."
                />
              </div>

              <div>
                <Label htmlFor="transport">Transportation (₹)</Label>
                <Input
                  id="transport"
                  type="number"
                  value={expenses.transport}
                  onChange={(e) => handleExpenseChange('transport', e.target.value)}
                  placeholder="Fuel, public transport, etc."
                />
              </div>

              <div>
                <Label htmlFor="utilities">Utilities (₹)</Label>
                <Input
                  id="utilities"
                  type="number"
                  value={expenses.utilities}
                  onChange={(e) => handleExpenseChange('utilities', e.target.value)}
                  placeholder="Electricity, water, internet, etc."
                />
              </div>

              <div>
                <Label htmlFor="entertainment">Entertainment (₹)</Label>
                <Input
                  id="entertainment"
                  type="number"
                  value={expenses.entertainment}
                  onChange={(e) => handleExpenseChange('entertainment', e.target.value)}
                  placeholder="Movies, hobbies, etc."
                />
              </div>

              <div>
                <Label htmlFor="healthcare">Healthcare (₹)</Label>
                <Input
                  id="healthcare"
                  type="number"
                  value={expenses.healthcare}
                  onChange={(e) => handleExpenseChange('healthcare', e.target.value)}
                  placeholder="Insurance, medical expenses, etc."
                />
              </div>

              <div>
                <Label htmlFor="savings">Savings (₹)</Label>
                <Input
                  id="savings"
                  type="number"
                  value={expenses.savings}
                  onChange={(e) => handleExpenseChange('savings', e.target.value)}
                  placeholder="Emergency fund, investments, etc."
                />
              </div>

              <div>
                <Label htmlFor="other">Other Expenses (₹)</Label>
                <Input
                  id="other"
                  type="number"
                  value={expenses.other}
                  onChange={(e) => handleExpenseChange('other', e.target.value)}
                  placeholder="Miscellaneous expenses"
                />
              </div>

              <Button 
                onClick={calculateBudget} 
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Calculate Budget
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <Card>
            <CardHeader>
              <CardTitle>Budget Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    ₹{results.monthlyIncome.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Monthly Income</div>
                </div>

                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <TrendingDown className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">
                    ₹{results.totalExpenses.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Expenses</div>
                </div>

                <div className={`text-center p-4 rounded-lg ${
                  results.remaining >= 0 ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <TrendingUp className={`h-8 w-8 mx-auto mb-2 ${
                    results.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <div className={`text-2xl font-bold ${
                    results.remaining >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ₹{results.remaining.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {results.remaining >= 0 ? 'Remaining' : 'Deficit'}
                  </div>
                </div>

                <div className={`text-center p-4 rounded-lg ${
                  results.savingsRate >= 20 ? 'bg-green-50' : 'bg-yellow-50'
                }`}>
                  <div className="text-2xl font-bold text-blue-600">
                    {results.savingsRate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Savings Rate</div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${
                results.isHealthy ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <h3 className="font-semibold mb-2">
                  {results.isHealthy ? '✅ Healthy Budget' : '⚠️ Budget Needs Attention'}
                </h3>
                <p className="text-sm text-gray-600">
                  {results.isHealthy 
                    ? 'Your budget looks good! You have positive cash flow and a healthy savings rate.'
                    : 'Consider reviewing your expenses and increasing your savings rate.'
                  }
                </p>
              </div>

              {getRecommendations().length > 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Recommendations</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {getRecommendations().map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 