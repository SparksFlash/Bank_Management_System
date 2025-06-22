import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Bank, Customer, Account, Transaction, AccountType, TransactionType } from '../types';

interface BankState extends Bank {
  nextCustomerId: number;
  nextAccountNumber: number;
  nextTransactionId: number;
}

type BankAction =
  | { type: 'CREATE_CUSTOMER'; payload: Omit<Customer, 'customerId' | 'createdDate'> }
  | { type: 'CREATE_ACCOUNT'; payload: { customerId: number; accountType: AccountType; initialBalance: number } }
  | { type: 'DEPOSIT'; payload: { accountNumber: string; amount: number; description: string } }
  | { type: 'WITHDRAW'; payload: { accountNumber: string; amount: number; description: string } }
  | { type: 'TRANSFER'; payload: { fromAccountNumber: string; toAccountNumber: string; amount: number; description: string } }
  | { type: 'DEACTIVATE_ACCOUNT'; payload: { accountNumber: string } };

const initialState: BankState = {
  bankName: 'First National Bank',
  customers: [
    {
      customerId: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '555-0123',
      address: '123 Main St',
      dateOfBirth: '1985-05-15',
      createdDate: new Date().toISOString()
    },
    {
      customerId: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@email.com',
      phone: '555-0456',
      address: '456 Oak Ave',
      dateOfBirth: '1990-08-22',
      createdDate: new Date().toISOString()
    }
  ],
  accounts: [
    {
      accountNumber: '1000',
      customerId: 1,
      accountType: AccountType.Checking,
      balance: 1500,
      createdDate: new Date().toISOString(),
      isActive: true,
      transactions: [
        {
          transactionId: 1,
          type: TransactionType.Deposit,
          amount: 1000,
          description: 'Initial deposit',
          transactionDate: new Date().toISOString()
        },
        {
          transactionId: 2,
          type: TransactionType.Deposit,
          amount: 500,
          description: 'Salary deposit',
          transactionDate: new Date().toISOString()
        }
      ]
    },
    {
      accountNumber: '1001',
      customerId: 1,
      accountType: AccountType.Savings,
      balance: 5000,
      createdDate: new Date().toISOString(),
      isActive: true,
      transactions: [
        {
          transactionId: 3,
          type: TransactionType.Deposit,
          amount: 5000,
          description: 'Initial deposit',
          transactionDate: new Date().toISOString()
        }
      ]
    },
    {
      accountNumber: '1002',
      customerId: 2,
      accountType: AccountType.Checking,
      balance: 2500,
      createdDate: new Date().toISOString(),
      isActive: true,
      transactions: [
        {
          transactionId: 4,
          type: TransactionType.Deposit,
          amount: 2500,
          description: 'Initial deposit',
          transactionDate: new Date().toISOString()
        }
      ]
    }
  ],
  nextCustomerId: 3,
  nextAccountNumber: 1003,
  nextTransactionId: 5
};

function bankReducer(state: BankState, action: BankAction): BankState {
  switch (action.type) {
    case 'CREATE_CUSTOMER': {
      const newCustomer: Customer = {
        ...action.payload,
        customerId: state.nextCustomerId,
        createdDate: new Date().toISOString()
      };
      return {
        ...state,
        customers: [...state.customers, newCustomer],
        nextCustomerId: state.nextCustomerId + 1
      };
    }

    case 'CREATE_ACCOUNT': {
      const { customerId, accountType, initialBalance } = action.payload;
      const transactions: Transaction[] = [];
      
      if (initialBalance > 0) {
        transactions.push({
          transactionId: state.nextTransactionId,
          type: TransactionType.Deposit,
          amount: initialBalance,
          description: 'Initial deposit',
          transactionDate: new Date().toISOString()
        });
      }

      const newAccount: Account = {
        accountNumber: state.nextAccountNumber.toString(),
        customerId,
        accountType,
        balance: initialBalance,
        createdDate: new Date().toISOString(),
        isActive: true,
        transactions
      };

      return {
        ...state,
        accounts: [...state.accounts, newAccount],
        nextAccountNumber: state.nextAccountNumber + 1,
        nextTransactionId: state.nextTransactionId + (initialBalance > 0 ? 1 : 0)
      };
    }

    case 'DEPOSIT': {
      const { accountNumber, amount, description } = action.payload;
      const accountIndex = state.accounts.findIndex(acc => acc.accountNumber === accountNumber);
      
      if (accountIndex === -1 || !state.accounts[accountIndex].isActive || amount <= 0) {
        return state;
      }

      const updatedAccounts = [...state.accounts];
      const account = { ...updatedAccounts[accountIndex] };
      
      account.balance += amount;
      account.transactions = [
        ...account.transactions,
        {
          transactionId: state.nextTransactionId,
          type: TransactionType.Deposit,
          amount,
          description,
          transactionDate: new Date().toISOString(),
          balanceAfter: account.balance
        }
      ];
      
      updatedAccounts[accountIndex] = account;

      return {
        ...state,
        accounts: updatedAccounts,
        nextTransactionId: state.nextTransactionId + 1
      };
    }

    case 'WITHDRAW': {
      const { accountNumber, amount, description } = action.payload;
      const accountIndex = state.accounts.findIndex(acc => acc.accountNumber === accountNumber);
      
      if (accountIndex === -1 || !state.accounts[accountIndex].isActive || amount <= 0 || state.accounts[accountIndex].balance < amount) {
        return state;
      }

      const updatedAccounts = [...state.accounts];
      const account = { ...updatedAccounts[accountIndex] };
      
      account.balance -= amount;
      account.transactions = [
        ...account.transactions,
        {
          transactionId: state.nextTransactionId,
          type: TransactionType.Withdrawal,
          amount,
          description,
          transactionDate: new Date().toISOString(),
          balanceAfter: account.balance
        }
      ];
      
      updatedAccounts[accountIndex] = account;

      return {
        ...state,
        accounts: updatedAccounts,
        nextTransactionId: state.nextTransactionId + 1
      };
    }

    case 'TRANSFER': {
      const { fromAccountNumber, toAccountNumber, amount, description } = action.payload;
      const fromAccountIndex = state.accounts.findIndex(acc => acc.accountNumber === fromAccountNumber);
      const toAccountIndex = state.accounts.findIndex(acc => acc.accountNumber === toAccountNumber);
      
      if (fromAccountIndex === -1 || toAccountIndex === -1 || 
          !state.accounts[fromAccountIndex].isActive || !state.accounts[toAccountIndex].isActive ||
          amount <= 0 || state.accounts[fromAccountIndex].balance < amount) {
        return state;
      }

      const updatedAccounts = [...state.accounts];
      const fromAccount = { ...updatedAccounts[fromAccountIndex] };
      const toAccount = { ...updatedAccounts[toAccountIndex] };
      
      fromAccount.balance -= amount;
      toAccount.balance += amount;
      
      const transferDate = new Date().toISOString();
      
      fromAccount.transactions = [
        ...fromAccount.transactions,
        {
          transactionId: state.nextTransactionId,
          type: TransactionType.Transfer,
          amount,
          description: `Transfer to ${toAccountNumber}`,
          transactionDate: transferDate,
          balanceAfter: fromAccount.balance
        }
      ];
      
      toAccount.transactions = [
        ...toAccount.transactions,
        {
          transactionId: state.nextTransactionId + 1,
          type: TransactionType.Transfer,
          amount,
          description: `Transfer from ${fromAccountNumber}`,
          transactionDate: transferDate,
          balanceAfter: toAccount.balance
        }
      ];
      
      updatedAccounts[fromAccountIndex] = fromAccount;
      updatedAccounts[toAccountIndex] = toAccount;

      return {
        ...state,
        accounts: updatedAccounts,
        nextTransactionId: state.nextTransactionId + 2
      };
    }

    case 'DEACTIVATE_ACCOUNT': {
      const { accountNumber } = action.payload;
      const accountIndex = state.accounts.findIndex(acc => acc.accountNumber === accountNumber);
      
      if (accountIndex === -1) {
        return state;
      }

      const updatedAccounts = [...state.accounts];
      updatedAccounts[accountIndex] = {
        ...updatedAccounts[accountIndex],
        isActive: false
      };

      return {
        ...state,
        accounts: updatedAccounts
      };
    }

    default:
      return state;
  }
}

interface BankContextType {
  state: BankState;
  createCustomer: (customer: Omit<Customer, 'customerId' | 'createdDate'>) => void;
  createAccount: (customerId: number, accountType: AccountType, initialBalance: number) => void;
  deposit: (accountNumber: string, amount: number, description: string) => boolean;
  withdraw: (accountNumber: string, amount: number, description: string) => boolean;
  transfer: (fromAccountNumber: string, toAccountNumber: string, amount: number, description: string) => boolean;
  deactivateAccount: (accountNumber: string) => void;
  getCustomerById: (customerId: number) => Customer | undefined;
  getAccountByNumber: (accountNumber: string) => Account | undefined;
  getAccountsByCustomerId: (customerId: number) => Account[];
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export function BankProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bankReducer, initialState);

  const createCustomer = (customer: Omit<Customer, 'customerId' | 'createdDate'>) => {
    dispatch({ type: 'CREATE_CUSTOMER', payload: customer });
  };

  const createAccount = (customerId: number, accountType: AccountType, initialBalance: number) => {
    dispatch({ type: 'CREATE_ACCOUNT', payload: { customerId, accountType, initialBalance } });
  };

  const deposit = (accountNumber: string, amount: number, description: string): boolean => {
    const account = state.accounts.find(acc => acc.accountNumber === accountNumber);
    if (!account || !account.isActive || amount <= 0) {
      return false;
    }
    dispatch({ type: 'DEPOSIT', payload: { accountNumber, amount, description } });
    return true;
  };

  const withdraw = (accountNumber: string, amount: number, description: string): boolean => {
    const account = state.accounts.find(acc => acc.accountNumber === accountNumber);
    if (!account || !account.isActive || amount <= 0 || account.balance < amount) {
      return false;
    }
    dispatch({ type: 'WITHDRAW', payload: { accountNumber, amount, description } });
    return true;
  };

  const transfer = (fromAccountNumber: string, toAccountNumber: string, amount: number, description: string): boolean => {
    const fromAccount = state.accounts.find(acc => acc.accountNumber === fromAccountNumber);
    const toAccount = state.accounts.find(acc => acc.accountNumber === toAccountNumber);
    
    if (!fromAccount || !toAccount || !fromAccount.isActive || !toAccount.isActive || 
        amount <= 0 || fromAccount.balance < amount) {
      return false;
    }
    
    dispatch({ type: 'TRANSFER', payload: { fromAccountNumber, toAccountNumber, amount, description } });
    return true;
  };

  const deactivateAccount = (accountNumber: string) => {
    dispatch({ type: 'DEACTIVATE_ACCOUNT', payload: { accountNumber } });
  };

  const getCustomerById = (customerId: number): Customer | undefined => {
    return state.customers.find(c => c.customerId === customerId);
  };

  const getAccountByNumber = (accountNumber: string): Account | undefined => {
    return state.accounts.find(a => a.accountNumber === accountNumber);
  };

  const getAccountsByCustomerId = (customerId: number): Account[] => {
    return state.accounts.filter(a => a.customerId === customerId);
  };

  return (
    <BankContext.Provider value={{
      state,
      createCustomer,
      createAccount,
      deposit,
      withdraw,
      transfer,
      deactivateAccount,
      getCustomerById,
      getAccountByNumber,
      getAccountsByCustomerId
    }}>
      {children}
    </BankContext.Provider>
  );
}

export function useBank() {
  const context = useContext(BankContext);
  if (context === undefined) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
}