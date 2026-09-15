using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SecureCms.Application.Events;
using SecureCms.Infrastructure.Persistence;

namespace SecureCms.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<SecureCmsDbContext>(options =>
            options.UseSqlite(configuration.GetConnectionString("SecureCms")));
        services.AddScoped<IEventRepository, EventRepository>();
        return services;
    }
}
