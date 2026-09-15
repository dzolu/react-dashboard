using Microsoft.EntityFrameworkCore;
using SecureCms.Domain.Events;

namespace SecureCms.Infrastructure.Persistence;

public sealed class SecureCmsDbContext(DbContextOptions<SecureCmsDbContext> options) : DbContext(options)
{
    public DbSet<AuditEvent> Events => Set<AuditEvent>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var entity = modelBuilder.Entity<AuditEvent>();
        entity.ToTable("Events");
        entity.HasKey(x => x.Id);
        entity.Property(x => x.Type).HasMaxLength(100).IsRequired();
        entity.Property(x => x.Message).HasMaxLength(500).IsRequired();
        entity.Property(x => x.Actor).HasMaxLength(100).IsRequired();
        entity.Property(x => x.CreatedByUserId).HasMaxLength(100).IsRequired();
        entity.Property(x => x.Severity).HasConversion<string>().HasMaxLength(20);
        entity.Property(x => x.CreatedAtUtc)
            .HasConversion(value => value, value => DateTime.SpecifyKind(value, DateTimeKind.Utc));
        entity.Property(x => x.UpdatedAtUtc)
            .HasConversion(value => value, value => DateTime.SpecifyKind(value, DateTimeKind.Utc));
        entity.Property(x => x.Version).IsConcurrencyToken();
        entity.HasIndex(x => x.CreatedAtUtc);
        entity.HasIndex(x => x.Severity);
    }
}
