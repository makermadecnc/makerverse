# https://github.com/dotnet/dotnet-docker/blob/master/samples/dotnetapp/Dockerfile.debian-arm32
FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build-env
WORKDIR /app

ARG DOTNET_RID=""
ARG DOTNET_ARCH="amd64"
RUN echo "Building ${DOTNET_ARCH} (${DOTNET_RID})"

# Install NPM
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && echo "node version: $(node --version)" \
    && echo "npm version: $(npm --version)" \
    && rm -rf /var/lib/apt/lists/*

# Upgrade NPM
ENV NPM_VERSION="7.15.1"
RUN npm install -g "npm@${NPM_VERSION}"

# Install yarn
RUN npm install --global yarn

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and install requirements
COPY . ./
RUN cd App && yarn install && cd ../

# Build the app
RUN if [ ! -z "$DOTNET_RID" ]; then \
    dotnet publish -c Release -o out -r "${DOTNET_RID}" --self-contained false --no-restore; \
  else \
    dotnet publish -c Release -o out --no-restore; \
  fi

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim-${DOTNET_ARCH}

WORKDIR /app
COPY --from=build-env /app/out .

ENTRYPOINT ["dotnet", "Makerverse.dll"]
