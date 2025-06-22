import React from 'react';
import { useBank } from '../context/BankContext';
import { AccountType } from '../types';
import { BarChart3, PieChart, TrendingUp, Users } from 'lucide-react';

const Reports: React.FC = () => {
  const { state } = useBank();

  // Calculate statistics
  const totalBalance = state.accounts
    .filter(account => account.isActive)
    .reduce((sum, account) => sum + account.balance, 0);

  const accountsByType = Object.values(AccountType).map(type => ({
    type,
    count: state.accounts.filter(account => account.accountType === type && account.isActive).length,
    balance: state.accounts
      .filter(account => account.accountType === type && account.isActive)
      .reduce((sum, account) => sum + account.balance, 0)
  }));

  const transactionsByType = ['Deposit', 'Withdrawal', 'Transfer'].map(type => {
    const transactions = state.accounts.flatMap(account => 
      account.transactions.filter(transaction => transaction.type === type)
    );
    return {
      type,
      count: transactions.length,
      amount: transactions.reduce((sum, transaction) => sum + transaction.amount, 0)
    };
  });

  const customerStats = state.customers.map(customer => {
    const customerAccounts = state.accounts.filter(account => account.customerId === customer.customerId);
    const totalBalance = customerAccounts.reduce((sum, account) => sum + account.balance, 0);
    const totalTransactions = customerAccounts.reduce((sum, account) => sum + account.transactions.length, 0);
    
    return {
      ...customer,
      accountCount: customerAccounts.length,
      totalBalance,
      totalTransactions
    };
  }).sort((a, b) => b.totalBalance - a.totalBalance);

  const getAccountTypeColor = (type: AccountType) => {
    switch (type) {
      case AccountType.Checking:
        return 'bg-blue-500';
      case AccountType.Savings:
        return 'bg-green-500';
      case AccountType.Business:
        return 'bg-purple-500';
      case AccountType.Investment:
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'Deposit':
        return 'bg-green-500';
      case 'Withdrawal':
        return 'bg-red-500';
      case 'Transfer':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reports & Analytics</h2>
        <p className="text-gray-600">Comprehensive overview of bank operations and statistics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Balance</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Accounts</p>
              <p className="text-2xl font-bold text-gray-900">
                {state.accounts.filter(account => account.isActive).length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900">{state.customers.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">
                {state.accounts.reduce((sum, account) => sum + account.transactions.length, 0)}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <PieChart className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Accounts by Type */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Accounts by Type</h3>
          <div className="space-y-4">
            {accountsByType.map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded ${getAccountTypeColor(item.type)}`} />
                  <span className="font-medium text-gray-900">{item.type}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{item.count} accounts</p>
                  <p className="text-sm text-gray-600">${item.balance.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transactions by Type */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transactions by Type</h3>
          <div className="space-y-4">
            {transactionsByType.map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded ${getTransactionTypeColor(item.type)}`} />
                  <span className="font-medium text-gray-900">{item.type}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{item.count} transactions</p>
                  <p className="text-sm text-gray-600">${item.amount.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Accounts</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Total Balance</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Transactions</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
              </tr>
            </thead>
            <tbody>
              {customerStats.map((customer) => (
                <tr key={customer.customerId} className="border-b border-gray-100">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </p>
                      <p className="text-sm text-gray-600">ID: {customer.customerId}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{customer.accountCount}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-gray-900">
                      ${customer.totalBalance.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-900">{customer.totalTransactions}</td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-600">
                      <p>{customer.email}</p>
                      <p>{customer.phone}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;