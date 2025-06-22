using System;
using System.Collections.Generic;
using System.Linq;

namespace BankManagementSystem
{
    public class Bank
    {
        public string BankName { get; set; }
        public List<Customer> Customers { get; set; }
        public List<Account> Accounts { get; set; }

        private int _nextCustomerId = 1;
        private int _nextAccountNumber = 1000;

        public Bank(string bankName)
        {
            BankName = bankName;
            Customers = new List<Customer>();
            Accounts = new List<Account>();
        }

        public Customer CreateCustomer(string firstName, string lastName, string email, string phone, string address, DateTime dateOfBirth)
        {
            var customer = new Customer(_nextCustomerId++, firstName, lastName, email, phone, address, dateOfBirth);
            Customers.Add(customer);
            Console.WriteLine($"Customer created successfully: {customer}");
            return customer;
        }

        public Account CreateAccount(int customerId, AccountType accountType, decimal initialBalance = 0)
        {
            var customer = GetCustomerById(customerId);
            if (customer == null)
            {
                Console.WriteLine("Customer not found.");
                return null;
            }

            var accountNumber = _nextAccountNumber++.ToString();
            var account = new Account(accountNumber, customerId, accountType, initialBalance);
            Accounts.Add(account);
            
            Console.WriteLine($"Account created successfully: {account}");
            return account;
        }

        public Customer GetCustomerById(int customerId)
        {
            return Customers.FirstOrDefault(c => c.CustomerId == customerId);
        }

        public Account GetAccountByNumber(string accountNumber)
        {
            return Accounts.FirstOrDefault(a => a.AccountNumber == accountNumber);
        }

        public List<Account> GetAccountsByCustomerId(int customerId)
        {
            return Accounts.Where(a => a.CustomerId == customerId).ToList();
        }

        public void DisplayAllCustomers()
        {
            Console.WriteLine($"\n=== All Customers in {BankName} ===");
            if (Customers.Count == 0)
            {
                Console.WriteLine("No customers found.");
                return;
            }

            foreach (var customer in Customers)
            {
                Console.WriteLine(customer);
                var customerAccounts = GetAccountsByCustomerId(customer.CustomerId);
                if (customerAccounts.Count > 0)
                {
                    Console.WriteLine("  Accounts:");
                    foreach (var account in customerAccounts)
                    {
                        Console.WriteLine($"    {account}");
                    }
                }
                Console.WriteLine();
            }
        }

        public void DisplayAllAccounts()
        {
            Console.WriteLine($"\n=== All Accounts in {BankName} ===");
            if (Accounts.Count == 0)
            {
                Console.WriteLine("No accounts found.");
                return;
            }

            foreach (var account in Accounts)
            {
                var customer = GetCustomerById(account.CustomerId);
                Console.WriteLine($"{account} - Owner: {customer?.GetFullName()}");
            }
        }

        public decimal GetTotalBankBalance()
        {
            return Accounts.Where(a => a.IsActive).Sum(a => a.Balance);
        }

        public void DisplayBankSummary()
        {
            Console.WriteLine($"\n=== {BankName} Summary ===");
            Console.WriteLine($"Total Customers: {Customers.Count}");
            Console.WriteLine($"Total Accounts: {Accounts.Count}");
            Console.WriteLine($"Active Accounts: {Accounts.Count(a => a.IsActive)}");
            Console.WriteLine($"Total Bank Balance: ${GetTotalBankBalance():F2}");
        }
    }
}