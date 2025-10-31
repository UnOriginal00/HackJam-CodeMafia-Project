using backend.Data;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

namespace backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            // OpenAPI / Swagger
            builder.Services.AddOpenApi();
            // DI for Chat Service (keep only what's needed for chats)
            builder.Services.AddScoped<ChatService>();
            // Register GroupsService so Controllers can resolve it
            builder.Services.AddScoped<GroupsService>();

            // Configure EF Core with MySQL
            builder.Services.AddDbContext<HackJamDbContext>(options =>
                options.UseMySql(builder.Configuration.GetConnectionString("HackJamDb"),
                    ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("HackJamDb"))));
                


            builder.Services.AddHttpClient();

            // Allow all CORS for simple testing (adjust for production)
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader();
                });
            });

            // NOTE: Authentication removed to keep things simple.
            // Controllers should not require [Authorize] if you want unrestricted chat posting.

            var app = builder.Build();

            app.UseCors("AllowAll");

            using (var scope = app.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<HackJamDbContext>();
                Console.WriteLine($"Can connect to DB: {db.Database.CanConnect()}");
            }

            // Configure the HTTP request pipeline.
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

            // Authentication/Authorization removed for simplicity:
            // app.UseAuthentication();
            // app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
