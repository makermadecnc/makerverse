ARG DOCKER_REGISTRY="mcr.microsoft.com"
ARG DOTNET_VERSION="5.0"
ARG DOTNET_SDK="$DOTNET_VERSION"
ARG DOTNET_RUNTIME="buster-slim"
ARG MAKER_BUILDER_ARCH="amd64"

# Based upon dotnet/sdk, with node.js and yarn installed
FROM $DOCKER_REGISTRY/openworkshop/base:latest-$MAKER_BUILDER_ARCH AS build-env
WORKDIR /app

# Copy file contents & build
COPY WebApp ./WebApp
COPY Server ./Server
RUN cd /app/WebApp && \
#    sed -i -e "s#https://registry.yarnpkg.com#${YARN_REGISTRY}#g" yarn.lock && \
#    sed -i -e "s#https://registry.npmjs.org#${YARN_REGISTRY}#g" yarn.lock && \
    yarn install
RUN cd /app/Server && dotnet publish -c Release -o /app/out && ls -la /app/out
RUN rm -rf WebApp && rm -rf Server

# After building everything, reconfigure Yarn to use the public registry.
ENV YARN_REGISTRY="https://registry.npmjs.org"
RUN yarn config set registry "https://registry.npmjs.org"

# Build runtime image
FROM $DOCKER_REGISTRY/dotnet/aspnet:$DOTNET_VERSION-$DOTNET_RUNTIME

WORKDIR /app
COPY --from=build-env /app/out .

ENTRYPOINT ["dotnet", "Makerverse.dll"]
