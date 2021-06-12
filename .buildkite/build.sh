#!/usr/bin/env bash

if [[ -z "$1" ]]; then
  ARCH=${BUILDKITE_AGENT_META_DATA_ARCH:-amd64}
else
  ARCH="$1"
fi

VERSIONED_IMAGE="${REGISTRY_LOCAL}/${DOCKER_REPO}:${ARCH}-${BUILDKITE_BUILD_NUMBER}"

if [[ $ARCH == "arm64v8" ]]; then
  echo "building ARM v8"
  buildah bud --arch arm --variant v8 --build-arg YARN_REGISTRY="$NPM_LOCAL_REGISTRY" \
    -t $VERSIONED_IMAGE arm64v8.Dockerfile
elif [[ $ARCH == "arm32v7" ]]; then
  echo "building ARM v7"
  buildah bud --arch arm --variant v7 --build-arg YARN_REGISTRY="$NPM_LOCAL_REGISTRY" \
    -t $VERSIONED_IMAGE arm32v7.Dockerfile
else
  echo "building for ${ARCH}"
  buildah bud --build-arg YARN_REGISTRY="$NPM_LOCAL_REGISTRY" \
    -t $VERSIONED_IMAGE amd64.Dockerfile
fi

#mkdir -p bin
#FN="./bin/${PRODUCT_NAME}.tar"
echo "pushing ${VERSIONED_IMAGE}"
#buildah push $IMAGE "docker-archive:${FN}:${VERSIONED_IMAGE}"
# "--creds=$DOCKER_USER:$DOCKER_PASS"
buildah push $VERSIONED_IMAGE
