using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace SecureCms.Api.Authentication;

public sealed class TokenService(JwtOptions options, TimeProvider timeProvider)
{
    public LoginResponse Create(DemoUser user)
    {
        var now = timeProvider.GetUtcNow();
        var expiresAt = now.AddMinutes(options.ExpirationMinutes);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.DisplayName),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.SigningKey)),
            SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            options.Issuer,
            options.Audience,
            claims,
            now.UtcDateTime,
            expiresAt.UtcDateTime,
            credentials);

        return new LoginResponse(
            new JwtSecurityTokenHandler().WriteToken(token),
            expiresAt,
            new AuthenticatedUser(user.Id, user.Email, user.DisplayName, user.Role));
    }
}

public sealed record LoginResponse(string AccessToken, DateTimeOffset ExpiresAt, AuthenticatedUser User);
public sealed record AuthenticatedUser(string Id, string Email, string DisplayName, string Role);
