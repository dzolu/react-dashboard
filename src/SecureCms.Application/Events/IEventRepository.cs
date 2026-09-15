using SecureCms.Domain.Events;

namespace SecureCms.Application.Events;

public interface IEventRepository
{
    Task<IReadOnlyList<AuditEvent>> ListAsync(EventQuery query, CancellationToken cancellationToken);
    Task<AuditEvent?> GetAsync(Guid id, CancellationToken cancellationToken);
    Task AddAsync(AuditEvent auditEvent, CancellationToken cancellationToken);
    void Remove(AuditEvent auditEvent);
    Task SaveChangesAsync(CancellationToken cancellationToken);
}
