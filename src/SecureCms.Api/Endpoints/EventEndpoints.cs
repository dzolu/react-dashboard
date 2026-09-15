using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using SecureCms.Application.Events;
using SecureCms.Domain.Events;

namespace SecureCms.Api.Endpoints;

public static class EventEndpoints
{
    public static IEndpointRouteBuilder MapEventEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/events")
            .RequireAuthorization(policy => policy.RequireRole("Editor", "Admin"))
            .WithTags("Events");

        group.MapGet("/", async ([FromQuery] string? search, [FromQuery] EventSeverity? severity,
            EventService service, CancellationToken cancellationToken) =>
            Results.Ok(await service.ListAsync(new EventQuery(search, severity), cancellationToken)))
            .Produces<IReadOnlyList<EventDto>>();

        group.MapGet("/{id:guid}", async (Guid id, EventService service, CancellationToken cancellationToken) =>
        {
            var auditEvent = await service.GetAsync(id, cancellationToken);
            return auditEvent is null ? Results.NotFound() : Results.Ok(auditEvent);
        }).Produces<EventDto>().Produces(404);

        group.MapPost("/", async ([FromBody] SaveEventRequest request, ClaimsPrincipal principal,
            EventService service, CancellationToken cancellationToken) =>
        {
            var errors = Validate(request);
            if (errors.Count > 0) return Results.ValidationProblem(errors);

            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? principal.FindFirstValue("sub") ?? "unknown";
            var created = await service.CreateAsync(
                new(request.Type, request.Message, request.Severity, request.Actor, userId), cancellationToken);
            return Results.Created($"/api/events/{created.Id}", created);
        }).Produces<EventDto>(201).ProducesValidationProblem();

        group.MapPut("/{id:guid}", async (Guid id, [FromBody] SaveEventRequest request,
            EventService service, CancellationToken cancellationToken) =>
        {
            var errors = Validate(request, requireVersion: true);
            if (errors.Count > 0) return Results.ValidationProblem(errors);

            var result = await service.UpdateAsync(
                new(id, request.Type, request.Message, request.Severity, request.Actor, request.Version!.Value),
                cancellationToken);
            return result.Kind switch
            {
                UpdateEventResultKind.NotFound => Results.NotFound(),
                UpdateEventResultKind.Conflict => Results.Problem(
                    statusCode: 409,
                    title: "The event was changed",
                    detail: "Refresh the data before saving again.",
                    extensions: new Dictionary<string, object?> { ["currentEvent"] = result.Event }),
                _ => Results.Ok(result.Event)
            };
        }).Produces<EventDto>().Produces(404).ProducesProblem(409).ProducesValidationProblem();

        group.MapDelete("/{id:guid}", async (Guid id, EventService service, CancellationToken cancellationToken) =>
            await service.DeleteAsync(id, cancellationToken) ? Results.NoContent() : Results.NotFound())
            .RequireAuthorization(policy => policy.RequireRole("Admin"))
            .Produces(204).Produces(404);

        return endpoints;
    }

    internal static Dictionary<string, string[]> Validate(SaveEventRequest request, bool requireVersion = false)
    {
        var errors = new Dictionary<string, string[]>();
        AddLengthError(errors, nameof(request.Type), request.Type, 2, 100);
        AddLengthError(errors, nameof(request.Message), request.Message, 5, 500);
        AddLengthError(errors, nameof(request.Actor), request.Actor, 2, 100);
        if (!Enum.IsDefined(request.Severity))
            errors[nameof(request.Severity)] = ["Severity must be info, warning or error."];
        if (requireVersion && request.Version is null or < 1)
            errors[nameof(request.Version)] = ["A positive version is required when updating an event."];
        return errors;
    }

    private static void AddLengthError(IDictionary<string, string[]> errors, string field,
        string? value, int min, int max)
    {
        var length = value?.Trim().Length ?? 0;
        if (length < min || length > max)
            errors[field] = [$"{field} must contain between {min} and {max} characters."];
    }
}

public sealed record SaveEventRequest(string Type, string Message, EventSeverity Severity, string Actor, int? Version = null);
