using backend.Data;
using backend.Models;
using backend.Models.DTOs;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services
{
    public class AuthenticationService
    {
        private readonly HackJamDbContext _context;
        private readonly IConfiguration _config;

        public AuthenticationService(HackJamDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
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
            
            //check in case
            System.Diagnostics.Debug.WriteLine($"newUser.Email before SaveChanges: '{newUser.Email}'");

            _context.Users.Add(newUser);
            //check in case

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

            return user; 
        }

        // Keep your existing SignupAsync / LoginAsync implementations.
        // Add this helper to generate a JWT for a given user id.
        public string GenerateJwtToken(int userId, string email, string? name = null, int? groupId = null)
        {
            var key = _config["Jwt:Key"];
            var issuer = _config["Jwt:Issuer"];
            var audience = _config["Jwt:Audience"];
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Email, email)
            };
            if (!string.IsNullOrEmpty(name)) claims.Add(new Claim(ClaimTypes.Name, name));
            if (groupId.HasValue) claims.Add(new Claim("group_id", groupId.Value.ToString()));

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer,
                audience,
                claims,
                expires: DateTime.UtcNow.AddHours(4),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
