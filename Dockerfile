ARG DOCKER_REGISTRY="mcr.microsoft.com"
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
ARG NPM_YARN_REGISTRY="https://registry.npmjs.org"
ENV YARN_REGISTRY="$NPM_YARN_REGISTRY"
RUN yarn config set registry "$YARN_REGISTRY"

# Copy file contents & build
COPY WebApp ./WebApp
COPY Server ./Server
RUN cd /app/WebApp && \
    sed -i -e "s#https://registry.yarnpkg.com#${YARN_REGISTRY}#g" yarn.lock && \
    sed -i -e "s#https://registry.npmjs.org#${YARN_REGISTRY}#g" yarn.lock && \
    yarn install --verbose
RUN cd /app/Server && dotnet publish -c Release -o out && ls -la out
RUN cat WebApp/yarn.lock
RUN rm -rf WebApp && rm -rf Server

# After building everything, reconfigure Yarn to use the public registry.
ENV YARN_REGISTRY="https://registry.npmjs.org"
RUN yarn config set registry "https://registry.npmjs.org"

# Build runtime image
FROM $DOCKER_REGISTRY/dotnet/aspnet:$DOTNET_VERSION-$DOTNET_RUNTIME

WORKDIR /app
COPY --from=build-env /app/out .

ENTRYPOINT ["dotnet", "Makerverse.dll"]
