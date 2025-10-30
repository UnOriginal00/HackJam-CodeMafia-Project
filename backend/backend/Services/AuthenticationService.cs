using backend.Data;
using backend.Models;
using backend.Models.DTOs;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace backend.Services
{
    public class AuthenticationService
    {
        private readonly HackJamDbContext _context;

        public AuthenticationService(HackJamDbContext context)
        {
            _context = context;
        }
        //SignUp User method
        public async Task<string> SignupAsync(SignupRequest request)
        {
            if (request == null)
                throw new ArgumentNullException(nameof(request));

            // Check if user already exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (existingUser != null)
                return "User already exists.";

            // Hash password
            var passwordHash = HashPassword(request.Password);

            // Create User (GroupId is optional)
            var newUser = new User
            {
                Email = request.Email,
                PasswordHash = passwordHash,
                GroupId = null // optional
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync(); // Save to generate UserId

            // 4️⃣ Create related UserDetails
            var userDetail = new User_Details
            {
                UserId = newUser.UserId,
                Name = request.Name,
                Surname = request.SurName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                JoinedAt = DateTime.Now
            };

            _context.UserDetails.Add(userDetail);
            await _context.SaveChangesAsync();

            return "User registered successfully.";
        }

        //Password Hashing
        private string HashPassword(string password)
        {
            using (var sha = SHA256.Create())
            {
                var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }

        //SignIn Method
        public async Task<User?> LoginAsync(backend.Models.DTOs.LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null) return null;

            var hashedPassword = HashPassword(request.Password);
            if (user.PasswordHash != hashedPassword) return null;

            return user; // Or return token/user info later
        }

    }
}
