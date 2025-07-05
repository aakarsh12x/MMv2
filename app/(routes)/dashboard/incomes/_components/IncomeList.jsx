"use client";
import React, { useEffect, useState } from "react";
import CreateIncomes from "./CreateIncomes";
import { useUser } from "@clerk/nextjs";
import IncomeItem from "./IncomeItem";

function IncomeList() {
  const [incomelist, setIncomelist] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    user && getIncomelist();
  }, [user]);

  const getIncomelist = async () => {
    try {
      // Get incomes for the current user
      const response = await fetch(`/api/incomes?createdBy=${encodeURIComponent(user?.primaryEmailAddress?.emailAddress || '')}`);
      if (!response.ok) throw new Error('Failed to fetch incomes');
      const incomes = await response.json();

      // For now, just use the incomes as is since income tracking doesn't need expense calculations
      const incomesWithData = incomes.map(income => ({
        ...income,
        totalSpend: 0, // Income doesn't have expenses
        totalItem: 0
      }));
      
      setIncomelist(incomesWithData);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    }
  };

  return (
    <div className="mt-7">
      <div
        className="grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <CreateIncomes refreshData={() => getIncomelist()} />
        {incomelist?.length > 0
          ? incomelist.map((budget, index) => (
              <IncomeItem budget={budget} key={index} />
            ))
          : [1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg
        h-[150px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default IncomeList;
