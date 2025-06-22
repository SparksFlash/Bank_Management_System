using System;
using System.Collections.Generic;

namespace BankManagementSystem
{
    public enum AccountType
    {
        Savings,
        Checking,
        Business,
        Investment
    }

    public class Account
    {
        public string AccountNumber { get; set; }
        public int CustomerId { get; set; }
        public AccountType AccountType { get; set; }
        public decimal Balance { get; private set; }
        public DateTime CreatedDate { get; set; }
        public bool IsActive { get; set; }
        public List<Transaction> Transactions { get; set; }

        public Account()
        {
            Transactions = new List<Transaction>();
            CreatedDate = DateTime.Now;
            IsActive = true;
        }

        public Account(string accountNumber, int customerId, AccountType accountType, decimal initialBalance = 0)
        {
            AccountNumber = accountNumber;
            CustomerId = customerId;
            AccountType = accountType;
            Balance = initialBalance;
            CreatedDate = DateTime.Now;
            IsActive = true;
            Transactions = new List<Transaction>();

            if (initialBalance > 0)
            {
                var initialTransaction = new Transaction(TransactionType.Deposit, initialBalance, "Initial deposit");
                Transactions.Add(initialTransaction);
            }
        }

        public bool Deposit(decimal amount, string description = "Deposit")
        {
            if (amount <= 0)
            {
                Console.WriteLine("Deposit amount must be positive.");
                return false;
            }

            if (!IsActive)
            {
                Console.WriteLine("Cannot deposit to inactive account.");
                return false;
            }

            Balance += amount;
            var transaction = new Transaction(TransactionType.Deposit, amount, description);
            Transactions.Add(transaction);
            
            Console.WriteLine($"Successfully deposited ${amount:F2}. New balance: ${Balance:F2}");
            return true;
        }

        public bool Withdraw(decimal amount, string description = "Withdrawal")
        {
            if (amount <= 0)
            {
                Console.WriteLine("Withdrawal amount must be positive.");
                return false;
            }

            if (!IsActive)
            {
                Console.WriteLine("Cannot withdraw from inactive account.");
                return false;
            }

            if (Balance < amount)
            {
                Console.WriteLine("Insufficient funds.");
                return false;
            }

            Balance -= amount;
            var transaction = new Transaction(TransactionType.Withdrawal, amount, description);
            Transactions.Add(transaction);
            
            Console.WriteLine($"Successfully withdrew ${amount:F2}. New balance: ${Balance:F2}");
            return true;
        }

        public bool Transfer(Account destinationAccount, decimal amount, string description = "Transfer")
        {
            if (destinationAccount == null)
            {
                Console.WriteLine("Invalid destination account.");
                return false;
            }

            if (this.Withdraw(amount, $"Transfer to {destinationAccount.AccountNumber}"))
            {
                if (destinationAccount.Deposit(amount, $"Transfer from {this.AccountNumber}"))
                {
                    Console.WriteLine($"Successfully transferred ${amount:F2} to account {destinationAccount.AccountNumber}");
                    return true;
                }
                else
                {
                    // Rollback the withdrawal if deposit fails
                    this.Deposit(amount, "Transfer rollback");
                    Console.WriteLine("Transfer failed. Amount has been refunded.");
                    return false;
                }
            }
            return false;
        }

        public void DisplayTransactionHistory()
        {
            Console.WriteLine($"\n=== Transaction History for Account {AccountNumber} ===");
            if (Transactions.Count == 0)
            {
                Console.WriteLine("No transactions found.");
                return;
            }

            foreach (var transaction in Transactions)
            {
                Console.WriteLine(transaction);
            }
        }

        public override string ToString()
        {
            return $"Account: {AccountNumber}, Type: {AccountType}, Balance: ${Balance:F2}, Status: {(IsActive ? "Active" : "Inactive")}";
        }
    }
}