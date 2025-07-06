import React from 'react'
import { User } from 'lucide-react'

function DashboardHeader() {
  return (
    <div className='p-5 shadow-sm border-b flex justify-between'>
        <div>
          
        </div>
        <div>
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
        </div>
       
    </div>
  )
}

export default DashboardHeader