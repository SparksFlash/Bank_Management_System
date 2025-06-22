using System;

namespace BankManagementSystem
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== Welcome to the Bank Management System ===\n");

            // Create a bank instance
            var bank = new Bank("First National Bank");

            // Create some sample customers
            var customer1 = bank.CreateCustomer("John", "Doe", "john.doe@email.com", "555-0123", "123 Main St", new DateTime(1985, 5, 15));
            var customer2 = bank.CreateCustomer("Jane", "Smith", "jane.smith@email.com", "555-0456", "456 Oak Ave", new DateTime(1990, 8, 22));
            var customer3 = bank.CreateCustomer("Bob", "Johnson", "bob.johnson@email.com", "555-0789", "789 Pine Rd", new DateTime(1978, 12, 3));

            Console.WriteLine("\n" + new string('=', 50));

            // Create accounts for customers
            var account1 = bank.CreateAccount(customer1.CustomerId, AccountType.Checking, 1000);
            var account2 = bank.CreateAccount(customer1.CustomerId, AccountType.Savings, 5000);
            var account3 = bank.CreateAccount(customer2.CustomerId, AccountType.Checking, 2500);
            var account4 = bank.CreateAccount(customer3.CustomerId, AccountType.Business, 10000);

            Console.WriteLine("\n" + new string('=', 50));

            // Demonstrate banking operations
            Console.WriteLine("\n=== Banking Operations Demo ===");

            // Deposits
            account1.Deposit(500, "Salary deposit");
            account2.Deposit(1000, "Bonus deposit");
            account3.Deposit(750, "Freelance payment");

            Console.WriteLine();

            // Withdrawals
            account1.Withdraw(200, "ATM withdrawal");
            account2.Withdraw(300, "Online purchase");
            account4.Withdraw(1500, "Business expense");

            Console.WriteLine();

            // Transfers
            account1.Transfer(account2, 250, "Transfer to savings");
            account3.Transfer(account1, 100, "Payment to John");

            Console.WriteLine("\n" + new string('=', 50));

            // Display transaction histories
            account1.DisplayTransactionHistory();
            account2.DisplayTransactionHistory();

            Console.WriteLine("\n" + new string('=', 50));

            // Display bank information
            bank.DisplayAllCustomers();
            bank.DisplayAllAccounts();
            bank.DisplayBankSummary();

            Console.WriteLine("\n" + new string('=', 50));

            // Interactive menu
            RunInteractiveMenu(bank);
        }

        static void RunInteractiveMenu(Bank bank)
        {
            while (true)
            {
                Console.WriteLine("\n=== Bank Management System Menu ===");
                Console.WriteLine("1. Create Customer");
                Console.WriteLine("2. Create Account");
                Console.WriteLine("3. Deposit Money");
                Console.WriteLine("4. Withdraw Money");
                Console.WriteLine("5. Transfer Money");
                Console.WriteLine("6. View Account Balance");
                Console.WriteLine("7. View Transaction History");
                Console.WriteLine("8. View All Customers");
                Console.WriteLine("9. View All Accounts");
                Console.WriteLine("10. Bank Summary");
                Console.WriteLine("0. Exit");
                Console.Write("\nEnter your choice: ");

                var choice = Console.ReadLine();

                switch (choice)
                {
                    case "1":
                        CreateCustomerInteractive(bank);
                        break;
                    case "2":
                        CreateAccountInteractive(bank);
                        break;
                    case "3":
                        DepositMoneyInteractive(bank);
                        break;
                    case "4":
                        WithdrawMoneyInteractive(bank);
                        break;
                    case "5":
                        TransferMoneyInteractive(bank);
                        break;
                    case "6":
                        ViewAccountBalanceInteractive(bank);
                        break;
                    case "7":
                        ViewTransactionHistoryInteractive(bank);
                        break;
                    case "8":
                        bank.DisplayAllCustomers();
                        break;
                    case "9":
                        bank.DisplayAllAccounts();
                        break;
                    case "10":
                        bank.DisplayBankSummary();
                        break;
                    case "0":
                        Console.WriteLine("Thank you for using the Bank Management System!");
                        return;
                    default:
                        Console.WriteLine("Invalid choice. Please try again.");
                        break;
                }

                Console.WriteLine("\nPress any key to continue...");
                Console.ReadKey();
            }
        }

        static void CreateCustomerInteractive(Bank bank)
        {
            Console.WriteLine("\n=== Create New Customer ===");
            Console.Write("First Name: ");
            var firstName = Console.ReadLine();
            Console.Write("Last Name: ");
            var lastName = Console.ReadLine();
            Console.Write("Email: ");
            var email = Console.ReadLine();
            Console.Write("Phone: ");
            var phone = Console.ReadLine();
            Console.Write("Address: ");
            var address = Console.ReadLine();
            Console.Write("Date of Birth (yyyy-mm-dd): ");
            
            if (DateTime.TryParse(Console.ReadLine(), out DateTime dateOfBirth))
            {
                bank.CreateCustomer(firstName, lastName, email, phone, address, dateOfBirth);
            }
            else
            {
                Console.WriteLine("Invalid date format.");
            }
        }

        static void CreateAccountInteractive(Bank bank)
        {
            Console.WriteLine("\n=== Create New Account ===");
            Console.Write("Customer ID: ");
            if (int.TryParse(Console.ReadLine(), out int customerId))
            {
                Console.WriteLine("Account Types:");
                Console.WriteLine("1. Savings");
                Console.WriteLine("2. Checking");
                Console.WriteLine("3. Business");
                Console.WriteLine("4. Investment");
                Console.Write("Choose account type (1-4): ");
                
                if (int.TryParse(Console.ReadLine(), out int typeChoice) && typeChoice >= 1 && typeChoice <= 4)
                {
                    var accountType = (AccountType)(typeChoice - 1);
                    Console.Write("Initial deposit amount: $");
                    
                    if (decimal.TryParse(Console.ReadLine(), out decimal initialBalance))
                    {
                        bank.CreateAccount(customerId, accountType, initialBalance);
                    }
                    else
                    {
                        Console.WriteLine("Invalid amount.");
                    }
                }
                else
                {
                    Console.WriteLine("Invalid account type.");
                }
            }
            else
            {
                Console.WriteLine("Invalid customer ID.");
            }
        }

        static void DepositMoneyInteractive(Bank bank)
        {
            Console.WriteLine("\n=== Deposit Money ===");
            Console.Write("Account Number: ");
            var accountNumber = Console.ReadLine();
            var account = bank.GetAccountByNumber(accountNumber);
            
            if (account != null)
            {
                Console.Write("Deposit amount: $");
                if (decimal.TryParse(Console.ReadLine(), out decimal amount))
                {
                    Console.Write("Description (optional): ");
                    var description = Console.ReadLine();
                    if (string.IsNullOrWhiteSpace(description))
                        description = "Deposit";
                    
                    account.Deposit(amount, description);
                }
                else
                {
                    Console.WriteLine("Invalid amount.");
                }
            }
            else
            {
                Console.WriteLine("Account not found.");
            }
        }

        static void WithdrawMoneyInteractive(Bank bank)
        {
            Console.WriteLine("\n=== Withdraw Money ===");
            Console.Write("Account Number: ");
            var accountNumber = Console.ReadLine();
            var account = bank.GetAccountByNumber(accountNumber);
            
            if (account != null)
            {
                Console.Write("Withdrawal amount: $");
                if (decimal.TryParse(Console.ReadLine(), out decimal amount))
                {
                    Console.Write("Description (optional): ");
                    var description = Console.ReadLine();
                    if (string.IsNullOrWhiteSpace(description))
                        description = "Withdrawal";
                    
                    account.Withdraw(amount, description);
                }
                else
                {
                    Console.WriteLine("Invalid amount.");
                }
            }
            else
            {
                Console.WriteLine("Account not found.");
            }
        }

        static void TransferMoneyInteractive(Bank bank)
        {
            Console.WriteLine("\n=== Transfer Money ===");
            Console.Write("From Account Number: ");
            var fromAccountNumber = Console.ReadLine();
            var fromAccount = bank.GetAccountByNumber(fromAccountNumber);
            
            if (fromAccount != null)
            {
                Console.Write("To Account Number: ");
                var toAccountNumber = Console.ReadLine();
                var toAccount = bank.GetAccountByNumber(toAccountNumber);
                
                if (toAccount != null)
                {
                    Console.Write("Transfer amount: $");
                    if (decimal.TryParse(Console.ReadLine(), out decimal amount))
                    {
                        Console.Write("Description (optional): ");
                        var description = Console.ReadLine();
                        if (string.IsNullOrWhiteSpace(description))
                            description = "Transfer";
                        
                        fromAccount.Transfer(toAccount, amount, description);
                    }
                    else
                    {
                        Console.WriteLine("Invalid amount.");
                    }
                }
                else
                {
                    Console.WriteLine("Destination account not found.");
                }
            }
            else
            {
                Console.WriteLine("Source account not found.");
            }
        }

        static void ViewAccountBalanceInteractive(Bank bank)
        {
            Console.WriteLine("\n=== View Account Balance ===");
            Console.Write("Account Number: ");
            var accountNumber = Console.ReadLine();
            var account = bank.GetAccountByNumber(accountNumber);
            
            if (account != null)
            {
                var customer = bank.GetCustomerById(account.CustomerId);
                Console.WriteLine($"\nAccount Details:");
                Console.WriteLine($"Account Number: {account.AccountNumber}");
                Console.WriteLine($"Account Holder: {customer?.GetFullName()}");
                Console.WriteLine($"Account Type: {account.AccountType}");
                Console.WriteLine($"Current Balance: ${account.Balance:F2}");
                Console.WriteLine($"Status: {(account.IsActive ? "Active" : "Inactive")}");
            }
            else
            {
                Console.WriteLine("Account not found.");
            }
        }

        static void ViewTransactionHistoryInteractive(Bank bank)
        {
            Console.WriteLine("\n=== View Transaction History ===");
            Console.Write("Account Number: ");
            var accountNumber = Console.ReadLine();
            var account = bank.GetAccountByNumber(accountNumber);
            
            if (account != null)
            {
                account.DisplayTransactionHistory();
            }
            else
            {
                Console.WriteLine("Account not found.");
            }
        }
    }
}