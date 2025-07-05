import React from "react";
import IncomeList from "./_components/IncomeList";

function Income() {
  return (
    <div className="p-6">
      <h2 className="font-bold text-3xl mb-6">My Income Streams</h2>
      <IncomeList />
    </div>
  );
}

export default Income;
