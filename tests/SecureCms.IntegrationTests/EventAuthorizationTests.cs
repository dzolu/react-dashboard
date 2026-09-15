using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace SecureCms.IntegrationTests;

public sealed class EventAuthorizationTests(SecureCmsApiFactory factory) : IClassFixture<SecureCmsApiFactory>
{
    [Fact]
    public async Task Events_without_token_return_unauthorized()
    {
        using var client = factory.CreateClient();
        var response = await client.GetAsync("/api/events");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Editor_can_list_events_ordered_by_creation_time()
    {
        using var client = factory.CreateClient();
        await AuthenticateAsync(client, "editor@securecms.local", "Editor123!");
        await client.PostAsJsonAsync("/api/events", new
        {
            type = "content.created",
            message = "An event used to verify the list endpoint.",
            severity = "info",
            actor = "Eva Editor"
        });

        var response = await client.GetAsync("/api/events");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var events = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.True(events.GetArrayLength() > 0);
    }

    [Fact]
    public async Task Editor_can_create_but_cannot_delete_event()
    {
        using var client = factory.CreateClient();
        await AuthenticateAsync(client, "editor@securecms.local", "Editor123!");

        var createResponse = await client.PostAsJsonAsync("/api/events", new
        {
            type = "content.published",
            message = "Landing page was published.",
            severity = "info",
            actor = "Eva Editor"
        });

        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);
        var created = await createResponse.Content.ReadFromJsonAsync<JsonElement>();
        var deleteResponse = await client.DeleteAsync($"/api/events/{created.GetProperty("id").GetGuid()}");
        Assert.Equal(HttpStatusCode.Forbidden, deleteResponse.StatusCode);
    }

    [Fact]
    public async Task Admin_can_delete_event()
    {
        using var client = factory.CreateClient();
        await AuthenticateAsync(client, "admin@securecms.local", "Admin123!");
        var createResponse = await client.PostAsJsonAsync("/api/events", new
        {
            type = "content.archived",
            message = "Landing page was archived.",
            severity = "warning",
            actor = "Adam Admin"
        });
        var created = await createResponse.Content.ReadFromJsonAsync<JsonElement>();

        var response = await client.DeleteAsync($"/api/events/{created.GetProperty("id").GetGuid()}");
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    private static async Task AuthenticateAsync(HttpClient client, string email, string password)
    {
        var response = await client.PostAsJsonAsync("/api/auth/login", new { email, password });
        response.EnsureSuccessStatusCode();
        var login = await response.Content.ReadFromJsonAsync<JsonElement>();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", login.GetProperty("accessToken").GetString());
    }
}
