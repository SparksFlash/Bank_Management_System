import React from 'react';
import { Building2, Users, CreditCard, ArrowLeftRight, BarChart3 } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: 'dashboard' | 'customers' | 'accounts' | 'transactions' | 'reports') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Building2 },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'accounts', label: 'Accounts', icon: CreditCard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-primary-600" />
            <h1 className="text-xl font-bold text-gray-900">First National Bank</h1>
          </div>
          
          <nav className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    activeTab === item.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;