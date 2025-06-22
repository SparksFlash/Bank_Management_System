using System;

namespace BankManagementSystem
{
    public enum TransactionType
    {
        Deposit,
        Withdrawal,
        Transfer
    }

    public class Transaction
    {
        public int TransactionId { get; set; }
        public TransactionType Type { get; set; }
        public decimal Amount { get; set; }
        public string Description { get; set; }
        public DateTime TransactionDate { get; set; }
        public decimal BalanceAfter { get; set; }

        private static int _nextTransactionId = 1;

        public Transaction()
        {
            TransactionId = _nextTransactionId++;
            TransactionDate = DateTime.Now;
        }

        public Transaction(TransactionType type, decimal amount, string description)
        {
            TransactionId = _nextTransactionId++;
            Type = type;
            Amount = amount;
            Description = description;
            TransactionDate = DateTime.Now;
        }

        public override string ToString()
        {
            string sign = Type == TransactionType.Deposit ? "+" : "-";
            return $"[{TransactionDate:yyyy-MM-dd HH:mm:ss}] {Type}: {sign}${Amount:F2} - {Description}";
        }
    }
}