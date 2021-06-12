ARG DOCKER_REGISTRY="mcr.microsoft.com"
ARG YARN_REGISTRY="https://registry.npmjs.org"
ARG DOTNET_VERSION="5.0"
ARG DOTNET_SDK="$DOTNET_VERSION"
ARG DOTNET_RUNTIME="buster-slim"

FROM $DOCKER_REGISTRY/dotnet/sdk:$DOTNET_SDK AS build-env
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
RUN yarn config set registry $YARN_REGISTRY

# Copy csproj and restore as distinct layers
COPY *.csproj ./

# Copy file contents & build
COPY . ./
RUN dotnet publish -c Release -o out

# Build runtime image
FROM $DOCKER_REGISTRY/dotnet/aspnet:$DOTNET_VERSION-$DOTNET_RUNTIME

WORKDIR /app
COPY --from=build-env /app/out .

ENTRYPOINT ["dotnet", "Makerverse.dll"]
