ARG DOCKER_REGISTRY="mcr.microsoft.com"
ARG DOTNET_VERSION="5.0"
ARG DOTNET_SDK="$DOTNET_VERSION"
ARG DOTNET_RUNTIME="buster-slim"
ARG MAKER_BUILDER_ARCH="amd64"
ARG NPM_YARN_REGISTRY="registry.npmjs.org"

# Based upon dotnet/sdk, with node.js and yarn installed
FROM $DOCKER_REGISTRY/openworkshop/hub-base:latest AS build-env
WORKDIR /app

# Copy file contents & build
COPY WebApp ./WebApp
COPY Server ./Server
RUN cd /app/Server && dotnet publish -c Release -o /app/out
RUN rm -rf WebApp && rm -rf Server

# Build runtime image
FROM $DOCKER_REGISTRY/dotnet/aspnet:$DOTNET_VERSION-$DOTNET_RUNTIME

WORKDIR /app
COPY --from=build-env /app/out .
COPY hub.env .
COPY maker.env .

ENTRYPOINT ["dotnet", "Makerverse.dll"]
