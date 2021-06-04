# https://github.com/dotnet/dotnet-docker/blob/master/samples/dotnetapp/Dockerfile.debian-arm32
FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build-env
WORKDIR /app

# Install NPM
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && echo "node version: $(node --version)" \
    && echo "npm version: $(npm --version)" \
    && rm -rf /var/lib/apt/lists/*

# Upgrade NPM
RUN npm install -g npm@latest

# Install yarn
RUN npm install --global yarn

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and install requirements
COPY . ./
RUN cd App && yarn install --production && cd ../

# Build the app
RUN dotnet publish -c Release -o out -r linux-arm64 --self-contained false --no-restore;

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim-arm64v8

# RPi-specific dependencies
RUN apt-get -y update && apt-get install -y libunwind8

WORKDIR /app
COPY --from=build-env /app/out .

ENTRYPOINT ["dotnet", "Makerverse.dll"]
