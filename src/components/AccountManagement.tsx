import React, { useState } from 'react';
import { useBank } from '../context/BankContext';
import { AccountType } from '../types';
import { Plus, CreditCard, Eye, EyeOff } from 'lucide-react';

const AccountManagement: React.FC = () => {
  const { state, createAccount, getCustomerById, deactivateAccount } = useBank();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    accountType: AccountType.Checking,
    initialBalance: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customerId = parseInt(formData.customerId);
    const initialBalance = parseFloat(formData.initialBalance) || 0;
    
    createAccount(customerId, formData.accountType, initialBalance);
    setFormData({
      customerId: '',
      accountType: AccountType.Checking,
      initialBalance: ''
    });
    setShowCreateForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getAccountTypeColor = (type: AccountType) => {
    switch (type) {
      case AccountType.Checking:
        return 'bg-blue-100 text-blue-800';
      case AccountType.Savings:
        return 'bg-green-100 text-green-800';
      case AccountType.Business:
        return 'bg-purple-100 text-purple-800';
      case AccountType.Investment:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Account Management</h2>
          <p className="text-gray-600">Manage bank accounts and balances</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Account</span>
        </button>
      </div>

      {/* Create Account Form */}
      {showCreateForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Account</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <select
                name="customerId"
                value={formData.customerId}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                <option value="">Select Customer</option>
                {state.customers.map((customer) => (
                  <option key={customer.customerId} value={customer.customerId}>
                    {customer.firstName} {customer.lastName} (ID: {customer.customerId})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                {Object.values(AccountType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Balance</label>
              <input
                type="number"
                name="initialBalance"
                value={formData.initialBalance}
                onChange={handleInputChange}
                className="input-field"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            <div className="md:col-span-3 flex space-x-3">
              <button type="submit" className="btn-primary">
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Account List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {state.accounts.map((account) => {
          const customer = getCustomerById(account.customerId);
          
          return (
            <div key={account.accountNumber} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-full">
                    <CreditCard className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Account {account.accountNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {customer?.firstName} {customer?.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAccountTypeColor(account.accountType)}`}>
                    {account.accountType}
                  </span>
                  {account.isActive ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-2xl font-bold text-gray-900">
                  ${account.balance.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Current Balance</p>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">
                    {new Date(account.createdDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transactions:</span>
                  <span className="text-gray-900">{account.transactions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={account.isActive ? 'text-green-600' : 'text-red-600'}>
                    {account.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              {account.isActive && (
                <div className="border-t pt-3">
                  <button
                    onClick={() => deactivateAccount(account.accountNumber)}
                    className="w-full text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Deactivate Account
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AccountManagement;