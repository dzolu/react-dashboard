using SecureCms.Application.Events;
using SecureCms.Domain.Events;

namespace SecureCms.UnitTests;

public sealed class EventServiceTests
{
    [Fact]
    public async Task Update_returns_conflict_when_client_version_is_stale()
    {
        var existing = AuditEvent.Create(
            "content.created", "Content was created", EventSeverity.Info,
            "Editor", "editor-1", DateTimeOffset.Parse("2026-01-01T10:00:00Z"));
        var repository = new InMemoryEventRepository(existing);
        var service = new EventService(repository, new FixedTimeProvider());

        var result = await service.UpdateAsync(
            new(existing.Id, "content.updated", "Content was updated", EventSeverity.Warning, "Editor", 99),
            CancellationToken.None);

        Assert.Equal(UpdateEventResultKind.Conflict, result.Kind);
        Assert.Equal(1, result.Event?.Version);
        Assert.Equal(0, repository.SaveCalls);
    }

    [Fact]
    public async Task Create_trims_values_and_sets_server_owned_metadata()
    {
        var repository = new InMemoryEventRepository();
        var service = new EventService(repository, new FixedTimeProvider());

        var result = await service.CreateAsync(
            new(" content.created ", " Content was created ", EventSeverity.Info, " Eva ", "editor-1"),
            CancellationToken.None);

        Assert.Equal("content.created", result.Type);
        Assert.Equal("Content was created", result.Message);
        Assert.Equal("2026-01-01T12:00:00.0000000Z", result.CreatedAt.ToString("O"));
        Assert.Equal(1, result.Version);
        Assert.Equal(1, repository.SaveCalls);
    }

    private sealed class FixedTimeProvider : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => DateTimeOffset.Parse("2026-01-01T12:00:00Z");
    }

    private sealed class InMemoryEventRepository(params AuditEvent[] seed) : IEventRepository
    {
        private readonly List<AuditEvent> events = [.. seed];
        public int SaveCalls { get; private set; }

        public Task<IReadOnlyList<AuditEvent>> ListAsync(EventQuery query, CancellationToken cancellationToken) =>
            Task.FromResult<IReadOnlyList<AuditEvent>>(events);
        public Task<AuditEvent?> GetAsync(Guid id, CancellationToken cancellationToken) =>
            Task.FromResult(events.SingleOrDefault(x => x.Id == id));
        public Task AddAsync(AuditEvent auditEvent, CancellationToken cancellationToken)
        {
            events.Add(auditEvent);
            return Task.CompletedTask;
        }
        public void Remove(AuditEvent auditEvent) => events.Remove(auditEvent);
        public Task SaveChangesAsync(CancellationToken cancellationToken)
        {
            SaveCalls++;
            return Task.CompletedTask;
        }
    }
}
