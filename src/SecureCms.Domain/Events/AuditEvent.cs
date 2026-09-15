namespace SecureCms.Domain.Events;

public sealed class AuditEvent
{
    private AuditEvent() { }

    public Guid Id { get; private set; }
    public string Type { get; private set; } = string.Empty;
    public string Message { get; private set; } = string.Empty;
    public EventSeverity Severity { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime UpdatedAtUtc { get; private set; }
    public string Actor { get; private set; } = string.Empty;
    public string CreatedByUserId { get; private set; } = string.Empty;
    public int Version { get; private set; }

    public static AuditEvent Create(
        string type,
        string message,
        EventSeverity severity,
        string actor,
        string createdByUserId,
        DateTimeOffset now)
    {
        return new AuditEvent
        {
            Id = Guid.NewGuid(),
            Type = type.Trim(),
            Message = message.Trim(),
            Severity = severity,
            Actor = actor.Trim(),
            CreatedByUserId = createdByUserId,
            CreatedAtUtc = now.UtcDateTime,
            UpdatedAtUtc = now.UtcDateTime,
            Version = 1
        };
    }

    public void Update(
        string type,
        string message,
        EventSeverity severity,
        string actor,
        DateTimeOffset now)
    {
        Type = type.Trim();
        Message = message.Trim();
        Severity = severity;
        Actor = actor.Trim();
        UpdatedAtUtc = now.UtcDateTime;
        Version++;
    }
}
