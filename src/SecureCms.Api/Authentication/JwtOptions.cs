namespace SecureCms.Api.Authentication;

public sealed class JwtOptions
{
    public const string SectionName = "Jwt";
    public required string Issuer { get; init; }
    public required string Audience { get; init; }
    public string SigningKey { get; set; } = string.Empty;
    public int ExpirationMinutes { get; init; } = 30;
}
