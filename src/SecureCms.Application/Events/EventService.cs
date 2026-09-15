using SecureCms.Domain.Events;

namespace SecureCms.Application.Events;

public sealed class EventService(IEventRepository repository, TimeProvider timeProvider)
{
    public async Task<IReadOnlyList<EventDto>> ListAsync(EventQuery query, CancellationToken cancellationToken)
    {
        var events = await repository.ListAsync(query, cancellationToken);
        return events.Select(ToDto).ToArray();
    }

    public async Task<EventDto?> GetAsync(Guid id, CancellationToken cancellationToken)
    {
        var auditEvent = await repository.GetAsync(id, cancellationToken);
        return auditEvent is null ? null : ToDto(auditEvent);
    }

    public async Task<EventDto> CreateAsync(CreateEventCommand command, CancellationToken cancellationToken)
    {
        var auditEvent = AuditEvent.Create(
            command.Type,
            command.Message,
            command.Severity,
            command.Actor,
            command.CreatedByUserId,
            timeProvider.GetUtcNow());

        await repository.AddAsync(auditEvent, cancellationToken);
        await repository.SaveChangesAsync(cancellationToken);
        return ToDto(auditEvent);
    }

    public async Task<UpdateEventResult> UpdateAsync(UpdateEventCommand command, CancellationToken cancellationToken)
    {
        var auditEvent = await repository.GetAsync(command.Id, cancellationToken);
        if (auditEvent is null)
        {
            return new(UpdateEventResultKind.NotFound);
        }

        if (auditEvent.Version != command.Version)
        {
            return new(UpdateEventResultKind.Conflict, ToDto(auditEvent));
        }

        auditEvent.Update(
            command.Type,
            command.Message,
            command.Severity,
            command.Actor,
            timeProvider.GetUtcNow());

        await repository.SaveChangesAsync(cancellationToken);
        return new(UpdateEventResultKind.Updated, ToDto(auditEvent));
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken cancellationToken)
    {
        var auditEvent = await repository.GetAsync(id, cancellationToken);
        if (auditEvent is null)
        {
            return false;
        }

        repository.Remove(auditEvent);
        await repository.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static EventDto ToDto(AuditEvent auditEvent) => new(
        auditEvent.Id,
        auditEvent.Type,
        auditEvent.Message,
        auditEvent.Severity.ToString().ToLowerInvariant(),
        auditEvent.CreatedAtUtc,
        auditEvent.UpdatedAtUtc,
        auditEvent.Actor,
        auditEvent.CreatedByUserId,
        auditEvent.Version);
}
