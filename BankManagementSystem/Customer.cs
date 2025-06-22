using System;

namespace BankManagementSystem
{
    public class Customer
    {
        public int CustomerId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime CreatedDate { get; set; }

        public Customer()
        {
            CreatedDate = DateTime.Now;
        }

        public Customer(int customerId, string firstName, string lastName, string email, string phone, string address, DateTime dateOfBirth)
        {
            CustomerId = customerId;
            FirstName = firstName;
            LastName = lastName;
            Email = email;
            Phone = phone;
            Address = address;
            DateOfBirth = dateOfBirth;
            CreatedDate = DateTime.Now;
        }

        public string GetFullName()
        {
            return $"{FirstName} {LastName}";
        }

        public int GetAge()
        {
            var today = DateTime.Today;
            var age = today.Year - DateOfBirth.Year;
            if (DateOfBirth.Date > today.AddYears(-age)) age--;
            return age;
        }

        public override string ToString()
        {
            return $"Customer ID: {CustomerId}, Name: {GetFullName()}, Email: {Email}, Phone: {Phone}";
        }
    }
}