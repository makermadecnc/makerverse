#!/usr/bin/env bash

if [[ -z "$1" ]]; then
  ARCH=${BUILDKITE_AGENT_META_DATA_ARCH:-amd64}
else
  ARCH="$1"
fi

VERSIONED_IMAGE="${DOCKER_REPO}:${ARCH}-${BUILDKITE_BUILD_NUMBER}"

if [[ $ARCH == "arm64v8" ]]; then
  echo "building ARM v8"
  buildah bud --arch arm --variant v8 -t $VERSIONED_IMAGE arm64v8.Dockerfile
elif [[ $ARCH == "arm32v7" ]]; then
  echo "building ARM v7"
  buildah bud --arch arm --variant v7 -t $VERSIONED_IMAGE arm32v7.Dockerfile
else
  echo "building for ${$ARCH}"
  buildah bud -t $VERSIONED_IMAGE amd64.Dockerfile
fi

#mkdir -p bin
#FN="./bin/${PRODUCT_NAME}.tar"
echo "pushing ${VERSIONED_IMAGE}"
#buildah push $IMAGE "docker-archive:${FN}:${VERSIONED_IMAGE}"
buildah push "--creds=$DOCKER_USER:$DOCKER_PASS" $VERSIONED_IMAGE
