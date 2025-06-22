import React, { useState } from 'react';
import { useBank } from '../context/BankContext';
import { Plus, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const CustomerManagement: React.FC = () => {
  const { state, createCustomer, getAccountsByCustomerId } = useBank();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCustomer(formData);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: ''
    });
    setShowCreateForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-gray-600">Manage customer accounts and information</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Create Customer Form */}
      {showCreateForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Customer</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="input-field"
                required
              />
            </div>
            <div className="md:col-span-2 flex space-x-3">
              <button type="submit" className="btn-primary">
                Create Customer
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

      {/* Customer List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {state.customers.map((customer) => {
          const customerAccounts = getAccountsByCustomerId(customer.customerId);
          const totalBalance = customerAccounts.reduce((sum, account) => sum + account.balance, 0);
          
          return (
            <div key={customer.customerId} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-full">
                    <User className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">ID: {customer.customerId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${totalBalance.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600">Total Balance</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{customer.address}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>Born: {new Date(customer.dateOfBirth).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Accounts ({customerAccounts.length})
                </p>
                {customerAccounts.length > 0 ? (
                  <div className="space-y-1">
                    {customerAccounts.map((account) => (
                      <div key={account.accountNumber} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {account.accountType} ({account.accountNumber})
                        </span>
                        <span className="font-medium text-gray-900">
                          ${account.balance.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No accounts</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerManagement;