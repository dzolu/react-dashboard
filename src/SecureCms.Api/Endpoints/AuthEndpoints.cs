using Microsoft.AspNetCore.Mvc;
using SecureCms.Api.Authentication;

namespace SecureCms.Api.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/auth/login", (
            [FromBody] LoginRequest request,
            DemoUserStore users,
            TokenService tokens) =>
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return Results.ValidationProblem(new Dictionary<string, string[]>
                {
                    ["credentials"] = ["Email and password are required."]
                });
            }

            var user = users.Validate(request.Email, request.Password);
            return user is null
                ? Results.Problem(statusCode: 401, title: "Invalid credentials", detail: "The email or password is incorrect.")
                : Results.Ok(tokens.Create(user));
        })
        .AllowAnonymous()
        .WithTags("Authentication")
        .Produces<LoginResponse>()
        .ProducesProblem(401)
        .ProducesValidationProblem();

        return endpoints;
    }
}

public sealed record LoginRequest(string Email, string Password);
