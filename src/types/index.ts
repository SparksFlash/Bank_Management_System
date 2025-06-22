export enum AccountType {
  Savings = 'Savings',
  Checking = 'Checking',
  Business = 'Business',
  Investment = 'Investment'
}

export enum TransactionType {
  Deposit = 'Deposit',
  Withdrawal = 'Withdrawal',
  Transfer = 'Transfer'
}

export interface Customer {
  customerId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  createdDate: string;
}

export interface Account {
  accountNumber: string;
  customerId: number;
  accountType: AccountType;
  balance: number;
  createdDate: string;
  isActive: boolean;
  transactions: Transaction[];
}

export interface Transaction {
  transactionId: number;
  type: TransactionType;
  amount: number;
  description: string;
  transactionDate: string;
  balanceAfter?: number;
}

export interface Bank {
  bankName: string;
  customers: Customer[];
  accounts: Account[];
}