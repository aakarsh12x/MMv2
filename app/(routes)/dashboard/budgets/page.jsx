import React from 'react'
import BudgetList from './_components/BudgetList'

function Budget() {
  return (
    <div className='p-6'>
      <h2 className='font-bold text-3xl mb-6'>My Budgets</h2>
      <BudgetList/>
    </div>
  )
}

export default Budget