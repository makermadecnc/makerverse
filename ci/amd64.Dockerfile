# https://github.com/dotnet/dotnet-docker/blob/master/samples/dotnetapp/Dockerfile.debian-arm32
FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build-env
WORKDIR /app

# Install NPM
RUN curl -sL https://deb.nodesource.com/setup_15.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && echo "node version: $(node --version)" \
    && echo "npm version: $(npm --version)" \
    && rm -rf /var/lib/apt/lists/*

# Install yarn
RUN npm install --global yarn

# Copy csproj and restore as distinct layers
COPY *.csproj ./
COPY NuGet.config ./
RUN dotnet restore

# Copy everything else and buil
COPY . ./
RUN dotnet publish -c Release -o out --no-restore

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:5.0

WORKDIR /app
COPY --from=build-env /app/out .

ENTRYPOINT ["dotnet", "Makerverse.dll"]
