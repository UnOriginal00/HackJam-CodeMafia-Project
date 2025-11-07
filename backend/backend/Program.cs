using backend.Data;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddOpenApi();

            // DI registrations
            builder.Services.AddScoped<AuthenticationService>();
            builder.Services.AddScoped<ChatService>();
            builder.Services.AddScoped<GroupsService>();
            builder.Services.AddScoped<IdeasService>();
            builder.Services.AddScoped<VotesService>();
            builder.Services.AddScoped<DashboardService>();

            // Configure EF Core with MySQL
            builder.Services.AddDbContext<HackJamDbContext>(options =>
                options.UseMySql(builder.Configuration.GetConnectionString("HackJamDb"),
                ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("HackJamDb"))));

            // JWT configuration
            var jwtSection = builder.Configuration.GetSection("Jwt");
            var key = Encoding.UTF8.GetBytes(jwtSection["Key"] ?? throw new InvalidOperationException("JWT Key missing in config"));

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false; // set true in production
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwtSection["Issuer"],
                    ValidateAudience = true,
                    ValidAudience = jwtSection["Audience"],
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ClockSkew = TimeSpan.FromMinutes(2)
                };
            });

            builder.Services.AddHttpClient();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            var app = builder.Build();

            app.UseCors("AllowAll");

            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<HackJamDbContext>();
                Console.WriteLine($"Can connect to DB: {db.Database.CanConnect()}");
            }

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference(options =>
                {
                    options.WithTitle("Your API Title")
                           .WithTheme(ScalarTheme.Saturn)
                           .EnableDarkMode();
                });
            }

            app.UseHttpsRedirection();

            // IMPORTANT: authentication before authorization and before controllers
            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();
            app.Run();
        }
    }
}
