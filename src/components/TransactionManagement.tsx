import React, { useState } from 'react';
import { useBank } from '../context/BankContext';
import { ArrowDownLeft, ArrowUpRight, ArrowLeftRight, Plus } from 'lucide-react';

type TransactionFormType = 'deposit' | 'withdraw' | 'transfer' | null;

const TransactionManagement: React.FC = () => {
  const { state, deposit, withdraw, transfer, getCustomerById, getAccountByNumber } = useBank();
  const [activeForm, setActiveForm] = useState<TransactionFormType>(null);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    toAccount: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    const description = formData.description || getDefaultDescription();
    
    let success = false;
    
    switch (activeForm) {
      case 'deposit':
        success = deposit(selectedAccount, amount, description);
        break;
      case 'withdraw':
        success = withdraw(selectedAccount, amount, description);
        break;
      case 'transfer':
        success = transfer(selectedAccount, formData.toAccount, amount, description);
        break;
    }
    
    if (success) {
      setMessage({ type: 'success', text: `${activeForm} completed successfully!` });
      resetForm();
    } else {
      setMessage({ type: 'error', text: `${activeForm} failed. Please check the details and try again.` });
    }
    
    setTimeout(() => setMessage(null), 3000);
  };

  const getDefaultDescription = () => {
    switch (activeForm) {
      case 'deposit': return 'Deposit';
      case 'withdraw': return 'Withdrawal';
      case 'transfer': return 'Transfer';
      default: return '';
    }
  };

  const resetForm = () => {
    setFormData({ amount: '', description: '', toAccount: '' });
    setSelectedAccount('');
    setActiveForm(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const allTransactions = state.accounts
    .flatMap(account => 
      account.transactions.map(transaction => ({
        ...transaction,
        accountNumber: account.accountNumber,
        customerName: state.customers.find(c => c.customerId === account.customerId)?.firstName + ' ' + 
                     state.customers.find(c => c.customerId === account.customerId)?.lastName
      }))
    )
    .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Deposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case 'Withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case 'Transfer':
        return <ArrowLeftRight className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transaction Management</h2>
          <p className="text-gray-600">Process deposits, withdrawals, and transfers</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveForm('deposit')}
            className="btn-primary flex items-center space-x-2"
          >
            <ArrowDownLeft className="h-4 w-4" />
            <span>Deposit</span>
          </button>
          <button
            onClick={() => setActiveForm('withdraw')}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowUpRight className="h-4 w-4" />
            <span>Withdraw</span>
          </button>
          <button
            onClick={() => setActiveForm('transfer')}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>Transfer</span>
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Transaction Form */}
      {activeForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
            {activeForm} Transaction
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {activeForm === 'transfer' ? 'From Account' : 'Account'}
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select Account</option>
                  {state.accounts.filter(account => account.isActive).map((account) => {
                    const customer = getCustomerById(account.customerId);
                    return (
                      <option key={account.accountNumber} value={account.accountNumber}>
                        {account.accountNumber} - {customer?.firstName} {customer?.lastName} 
                        (${account.balance.toFixed(2)})
                      </option>
                    );
                  })}
                </select>
              </div>
              
              {activeForm === 'transfer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Account</label>
                  <select
                    name="toAccount"
                    value={formData.toAccount}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Select Destination Account</option>
                    {state.accounts
                      .filter(account => account.isActive && account.accountNumber !== selectedAccount)
                      .map((account) => {
                        const customer = getCustomerById(account.customerId);
                        return (
                          <option key={account.accountNumber} value={account.accountNumber}>
                            {account.accountNumber} - {customer?.firstName} {customer?.lastName}
                          </option>
                        );
                      })}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="input-field"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder={getDefaultDescription()}
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Process {activeForm}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transaction History */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
        {allTransactions.length > 0 ? (
          <div className="space-y-3">
            {allTransactions.map((transaction) => (
              <div key={transaction.transactionId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white rounded-full">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.customerName} • Account {transaction.accountNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.transactionDate).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'Deposit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'Deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 capitalize">{transaction.type}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionManagement;