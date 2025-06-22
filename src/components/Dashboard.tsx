import React from 'react';
import { useBank } from '../context/BankContext';
import { Users, CreditCard, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { state } = useBank();

  const totalBalance = state.accounts
    .filter(account => account.isActive)
    .reduce((sum, account) => sum + account.balance, 0);

  const activeAccounts = state.accounts.filter(account => account.isActive).length;
  const totalTransactions = state.accounts.reduce((sum, account) => sum + account.transactions.length, 0);

  const stats = [
    {
      title: 'Total Customers',
      value: state.customers.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Accounts',
      value: activeAccounts,
      icon: CreditCard,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Balance',
      value: `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Total Transactions',
      value: totalTransactions,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const recentTransactions = state.accounts
    .flatMap(account => 
      account.transactions.map(transaction => ({
        ...transaction,
        accountNumber: account.accountNumber,
        customerName: state.customers.find(c => c.customerId === account.customerId)?.firstName + ' ' + 
                     state.customers.find(c => c.customerId === account.customerId)?.lastName
      }))
    )
    .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Welcome to {state.bankName} Management System</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.transactionId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    transaction.type === 'Deposit' ? 'bg-green-100' :
                    transaction.type === 'Withdrawal' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      transaction.type === 'Deposit' ? 'bg-green-600' :
                      transaction.type === 'Withdrawal' ? 'bg-red-600' : 'bg-blue-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.customerName} • Account {transaction.accountNumber}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'Deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'Deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(transaction.transactionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No transactions yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;