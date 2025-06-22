import React, { useState } from 'react';
import { BankProvider } from './context/BankContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CustomerManagement from './components/CustomerManagement';
import AccountManagement from './components/AccountManagement';
import TransactionManagement from './components/TransactionManagement';
import Reports from './components/Reports';

type ActiveTab = 'dashboard' | 'customers' | 'accounts' | 'transactions' | 'reports';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <CustomerManagement />;
      case 'accounts':
        return <AccountManagement />;
      case 'transactions':
        return <TransactionManagement />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <BankProvider>
      <div className="min-h-screen bg-gray-50">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="container mx-auto px-4 py-8">
          {renderActiveComponent()}
        </main>
      </div>
    </BankProvider>
  );
}

export default App;