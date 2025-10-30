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
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
            //DI for Authentication Service
            builder.Services.AddScoped<AuthenticationService>();


            builder.Services.AddDbContext<HackJamDbContext>(options =>
            options.UseMySql(builder.Configuration.GetConnectionString("HackJamDb"),
            ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("HackJamDb"))));

            var app = builder.Build();


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

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
