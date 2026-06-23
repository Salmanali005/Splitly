import React, { useState } from 'react';
import MainLayout from '../Components/layout/MainLayout';
import Button from '../Components/common/Button';

const Settlements = () => {
  const [settlements] = useState([
    { id: 1, from: 'You', to: 'Alice Smith', amount: '$80', date: 'Jun 20, 2026', status: 'Completed' },
    { id: 2, from: 'Bob Johnson', to: 'You', amount: '$50', date: 'Jun 18, 2026', status: 'Pending' },
    { id: 3, from: 'Emily Davis', to: 'You', amount: '$70', date: 'Jun 15, 2026', status: 'Completed' },
    { id: 4, from: 'You', to: 'Alice Smith', amount: '$30', date: 'Jun 12, 2026', status: 'Completed' },
  ]);

  return (
    <MainLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">Settlements</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">Payment history</p>
        </div>
        <Button variant="primary" size="sm">+ New Settlement</Button>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {settlements.map((settlement) => (
            <div key={settlement.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <p className="text-sm text-black dark:text-white">
                  <span className="font-medium">{settlement.from}</span> paid <span className="font-medium">{settlement.to}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{settlement.date}</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm font-medium text-black dark:text-white">{settlement.amount}</span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  settlement.status === 'Completed' 
                    ? 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}>
                  {settlement.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Settlements;