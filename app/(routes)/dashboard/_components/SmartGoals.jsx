"use client";
import React, { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp, Calendar, DollarSign, CheckCircle } from 'lucide-react';

function SmartGoals() {
  const [goals, setGoals] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    currentAmount: 0,
    deadline: '',
    category: 'savings'
  });

  useEffect(() => {
    // Load goals from localStorage
    const savedGoals = localStorage.getItem('financialGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const saveGoals = (updatedGoals) => {
    localStorage.setItem('financialGoals', JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount) return;
    
    const goal = {
      id: Date.now(),
      ...newGoal,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: 0,
      createdAt: new Date().toISOString()
    };
    
    const updatedGoals = [...goals, goal];
    saveGoals(updatedGoals);
    
    setNewGoal({
      title: '',
      targetAmount: '',
      currentAmount: 0,
      deadline: '',
      category: 'savings'
    });
    setShowAddForm(false);
  };

  const updateGoalProgress = (goalId, amount) => {
    const updatedGoals = goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentAmount: goal.currentAmount + parseFloat(amount) }
        : goal
    );
    saveGoals(updatedGoals);
  };

  const getProgressPercentage = (current, target) => {
    return Math.min(100, (current / target) * 100);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'emergency': return 'text-red-600 bg-red-100';
      case 'investment': return 'text-blue-600 bg-blue-100';
      case 'vacation': return 'text-green-600 bg-green-100';
      case 'savings': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'emergency': return '🚨';
      case 'investment': return '📈';
      case 'vacation': return '🏖️';
      case 'savings': return '💰';
      default: return '🎯';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-5 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Target className="text-blue-600 mr-2" size={20} />
            <h2 className="text-lg font-bold">Financial Goals</h2>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-1" />
            Add Goal
          </button>
        </div>
      </div>

      <div className="p-5">
        {showAddForm && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-3">Add New Goal</h3>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Goal title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Target amount"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="savings">💰 Savings</option>
                <option value="emergency">🚨 Emergency Fund</option>
                <option value="investment">📈 Investment</option>
                <option value="vacation">🏖️ Vacation</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={addGoal}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Add Goal
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {goals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="mx-auto text-gray-400 mb-2" size={24} />
            <p className="text-gray-500 mb-1">No financial goals set yet</p>
            <p className="text-gray-400 text-sm">Add your first goal to start tracking progress!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
              const isCompleted = progress >= 100;
              
              return (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">{getCategoryIcon(goal.category)}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{goal.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(goal.category)}`}>
                          {goal.category}
                        </span>
                      </div>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="text-green-500" size={20} />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">
                        ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{progress.toFixed(1)}% complete</span>
                      {goal.deadline && (
                        <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  {!isCompleted && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Add amount"
                          className="flex-1 px-3 py-1 border border-gray-200 rounded text-sm"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.target.value) {
                              updateGoalProgress(goal.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input = e.target.previousElementSibling;
                            if (input.value) {
                              updateGoalProgress(goal.id, input.value);
                              input.value = '';
                            }
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default SmartGoals; 