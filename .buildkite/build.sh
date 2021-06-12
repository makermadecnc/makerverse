#!/usr/bin/env bash

if [[ -z "$1" ]]; then
  ARCH=${BUILDKITE_AGENT_META_DATA_ARCH:-amd64}
else
  ARCH="$1"
fi

VERSIONED_IMAGE="${DOCKER_LOCAL_REGISTRY}/${DOCKER_REPO}:${ARCH}-${BUILDKITE_BUILD_NUMBER}"

if [[ $ARCH == "arm64v8" ]]; then
  echo "building ARM v8"
  buildah bud --arch arm --variant v8 \
    --build-arg YARN_REGISTRY="$NPM_LOCAL_REGISTRY" \
    --build-arg DOCKER_REGISTRY="$DOCKER_LOCAL_REGISTRY" \
    --build-arg DOTNET_RUNTIME="buster-slim-${ARCH}" \
    --build-arg DOTNET_SDK="5.0-arm" \
    -t $VERSIONED_IMAGE Dockerfile
elif [[ $ARCH == "arm32v7" ]]; then
  echo "building ARM v7"
  buildah bud --arch arm --variant v7 \
    --build-arg YARN_REGISTRY="$NPM_LOCAL_REGISTRY" \
    --build-arg DOCKER_REGISTRY="$DOCKER_LOCAL_REGISTRY" \
    --build-arg DOTNET_RUNTIME="buster-slim-${ARCH}" \
    --build-arg DOTNET_SDK="5.0-arm" \
    -t $VERSIONED_IMAGE Dockerfile
else
  echo "building for ${ARCH}"
  buildah bud \
    --build-arg YARN_REGISTRY="$NPM_LOCAL_REGISTRY" \
    --build-arg DOCKER_REGISTRY="$DOCKER_LOCAL_REGISTRY" \
    -t $VERSIONED_IMAGE Dockerfile
fi

#mkdir -p bin
#FN="./bin/${PRODUCT_NAME}.tar"
echo "pushing ${VERSIONED_IMAGE}"
#buildah push $IMAGE "docker-archive:${FN}:${VERSIONED_IMAGE}"
# "--creds=$DOCKER_USER:$DOCKER_PASS"
buildah push $VERSIONED_IMAGE
