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

            // DI registrations
            builder.Services.AddScoped<AuthenticationService>();
            builder.Services.AddScoped<ChatService>();
            builder.Services.AddScoped<GroupsService>();
            builder.Services.AddScoped<IdeasService>(); // <-- register IdeasService
            builder.Services.AddScoped<VotesService>(); // register votes service

            // Configure EF Core with MySQL
            builder.Services.AddDbContext<HackJamDbContext>(options =>
                options.UseMySql(builder.Configuration.GetConnectionString("HackJamDb"),
                ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("HackJamDb"))));

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
            app.MapControllers();
            app.Run();
        }
    }
}
