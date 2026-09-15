using Microsoft.EntityFrameworkCore;
using SecureCms.Domain.Events;

namespace SecureCms.Infrastructure.Persistence;

public static class DatabaseInitializer
{
    public static async Task InitializeAsync(SecureCmsDbContext dbContext, CancellationToken cancellationToken)
    {
        await dbContext.Database.EnsureCreatedAsync(cancellationToken);
        if (await dbContext.Events.AnyAsync(cancellationToken))
        {
            return;
        }

        var now = DateTimeOffset.UtcNow;
        var events = new[]
        {
            AuditEvent.Create("user.created", "Olivia Martin created a new workspace.", EventSeverity.Info, "Olivia Martin", "system", now.AddMinutes(-40)),
            AuditEvent.Create("payment.failed", "Monthly payment failed for Liam Johnson.", EventSeverity.Error, "Billing Service", "system", now.AddMinutes(-30)),
            AuditEvent.Create("settings.updated", "Security settings were updated.", EventSeverity.Warning, "Sophia Brown", "system", now.AddMinutes(-20))
        };

        await dbContext.Events.AddRangeAsync(events, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}
