import React, { useState } from 'react';
import MainLayout from '../Components/layout/MainLayout';
import Button from '../Components/common/Button';

const Balances = () => {
  const [balances] = useState([
    { id: 1, name: 'You', initials: 'JD', balance: '+$150', status: 'owed' },
    { id: 2, name: 'Alice Smith', initials: 'AS', balance: '-$80', status: 'owes' },
    { id: 3, name: 'Bob Johnson', initials: 'BJ', balance: '$0', status: 'settled' },
    { id: 4, name: 'Emily Davis', initials: 'ED', balance: '-$70', status: 'owes' },
  ]);

  const [debts] = useState([
    { from: 'Alice Smith', to: 'You', amount: '$80', status: 'pending' },
    { from: 'Emily Davis', to: 'You', amount: '$70', status: 'pending' },
    { from: 'You', to: 'Bob Johnson', amount: '$30', status: 'settled' },
  ]);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">Balances</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">Who owes whom</p>
      </div>

      {/* Summary */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">You are owed</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">+$150</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">You owe</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">-$0</p>
          </div>
        </div>
      </div>

      {/* Member balances */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 mb-4">
        <h3 className="font-semibold text-black dark:text-white mb-3">All Members</h3>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {balances.map((member) => (
            <div key={member.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium ${
                  member.balance === '$0' 
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    : member.balance.startsWith('+') 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                }`}>
                  {member.initials}
                </div>
                <span className="text-sm font-medium text-black dark:text-white">{member.name}</span>
              </div>
              <span className={`text-sm font-medium ${
                member.balance === '$0' 
                  ? 'text-gray-400 dark:text-gray-500'
                  : member.balance.startsWith('+') 
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
              }`}>
                {member.balance}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Settlement suggestions */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
        <h3 className="font-semibold text-black dark:text-white mb-3">Settle Up</h3>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {debts.map((debt, index) => (
            <div key={index} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <p className="text-sm text-black dark:text-white">
                  <span className="font-medium">{debt.from}</span> owes <span className="font-medium">{debt.to}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{debt.status}</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm font-medium text-black dark:text-white">{debt.amount}</span>
                {debt.status === 'pending' && (
                  <Button variant="primary" size="sm">Settle</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Balances;