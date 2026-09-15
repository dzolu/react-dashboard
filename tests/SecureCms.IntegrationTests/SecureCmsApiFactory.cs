using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using SecureCms.Infrastructure.Persistence;

namespace SecureCms.IntegrationTests;

public sealed class SecureCmsApiFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<SecureCmsDbContext>>();
            var databasePath = Path.Combine(Path.GetTempPath(), $"secure-cms-tests-{Guid.NewGuid()}.db");
            services.AddDbContext<SecureCmsDbContext>(options =>
                options.UseSqlite($"Data Source={databasePath}"));

            using var provider = services.BuildServiceProvider();
            using var scope = provider.CreateScope();
            scope.ServiceProvider.GetRequiredService<SecureCmsDbContext>().Database.EnsureCreated();
        });
    }
}
