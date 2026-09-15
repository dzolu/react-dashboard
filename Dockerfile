FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /source

COPY SecureCms.sln ./
COPY src/SecureCms.Api/SecureCms.Api.csproj src/SecureCms.Api/packages.lock.json src/SecureCms.Api/
COPY src/SecureCms.Application/SecureCms.Application.csproj src/SecureCms.Application/packages.lock.json src/SecureCms.Application/
COPY src/SecureCms.Domain/SecureCms.Domain.csproj src/SecureCms.Domain/packages.lock.json src/SecureCms.Domain/
COPY src/SecureCms.Infrastructure/SecureCms.Infrastructure.csproj src/SecureCms.Infrastructure/packages.lock.json src/SecureCms.Infrastructure/
RUN dotnet restore src/SecureCms.Api/SecureCms.Api.csproj --locked-mode

COPY src/ src/
RUN dotnet publish src/SecureCms.Api/SecureCms.Api.csproj -c Release --no-restore -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
RUN apt-get update \
    && apt-get install --no-install-recommends -y curl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/publish .
RUN mkdir -p /app/data && chown -R "$APP_UID":"$APP_UID" /app
USER $APP_UID
EXPOSE 8080
ENTRYPOINT ["dotnet", "SecureCms.Api.dll"]
