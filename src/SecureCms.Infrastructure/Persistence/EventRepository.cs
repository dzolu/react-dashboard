using Microsoft.EntityFrameworkCore;
using SecureCms.Application.Events;
using SecureCms.Domain.Events;

namespace SecureCms.Infrastructure.Persistence;

public sealed class EventRepository(SecureCmsDbContext dbContext) : IEventRepository
{
    public async Task<IReadOnlyList<AuditEvent>> ListAsync(EventQuery query, CancellationToken cancellationToken)
    {
        IQueryable<AuditEvent> events = dbContext.Events.AsNoTracking();

        if (query.Severity is not null)
        {
            events = events.Where(x => x.Severity == query.Severity);
        }

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var search = query.Search.Trim();
            events = events.Where(x =>
                x.Type.Contains(search) ||
                x.Message.Contains(search) ||
                x.Actor.Contains(search));
        }

        return await events
            .OrderByDescending(x => x.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public Task<AuditEvent?> GetAsync(Guid id, CancellationToken cancellationToken) =>
        dbContext.Events.SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

    public Task AddAsync(AuditEvent auditEvent, CancellationToken cancellationToken) =>
        dbContext.Events.AddAsync(auditEvent, cancellationToken).AsTask();

    public void Remove(AuditEvent auditEvent) => dbContext.Events.Remove(auditEvent);

    public Task SaveChangesAsync(CancellationToken cancellationToken) =>
        dbContext.SaveChangesAsync(cancellationToken);
}
