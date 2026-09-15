using SecureCms.Domain.Events;

namespace SecureCms.Application.Events;

public sealed record EventDto(
    Guid Id,
    string Type,
    string Message,
    string Severity,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    string Actor,
    string CreatedByUserId,
    int Version);

public sealed record EventQuery(string? Search, EventSeverity? Severity);

public sealed record CreateEventCommand(
    string Type,
    string Message,
    EventSeverity Severity,
    string Actor,
    string CreatedByUserId);

public sealed record UpdateEventCommand(
    Guid Id,
    string Type,
    string Message,
    EventSeverity Severity,
    string Actor,
    int Version);

public enum UpdateEventResultKind { Updated, NotFound, Conflict }

public sealed record UpdateEventResult(UpdateEventResultKind Kind, EventDto? Event = null);
