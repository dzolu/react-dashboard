namespace SecureCms.Api.Authentication;

public sealed record DemoUser(string Id, string Email, string DisplayName, string Role, string Password);

public sealed class DemoUserStore
{
    private static readonly DemoUser[] Users =
    [
        new("editor-1", "editor@securecms.local", "Eva Editor", "Editor", "Editor123!"),
        new("admin-1", "admin@securecms.local", "Adam Admin", "Admin", "Admin123!")
    ];

    public DemoUser? Validate(string email, string password) =>
        Users.SingleOrDefault(user =>
            string.Equals(user.Email, email.Trim(), StringComparison.OrdinalIgnoreCase) &&
            string.Equals(user.Password, password, StringComparison.Ordinal));
}
