#!/usr/bin/env bash

VERSIONED_IMAGE="${DOCKER_REPO}:${BUILDKITE_AGENT_META_DATA_ARCH}-${BUILDKITE_BUILD_NUMBER}"

if [[ $BUILDKITE_AGENT_META_DATA_ARCH == "arm64v8" ]]; then
  echo "building ARM v8"
  buildah bud --arch arm --variant v8 -t $VERSIONED_IMAGE arm64v8.Dockerfile
elif [[ $BUILDKITE_AGENT_META_DATA_ARCH == "arm32v7" ]]; then
  echo "building ARM v7"
  buildah bud --arch arm --variant v7 -t $VERSIONED_IMAGE arm.Dockerfile
else
  echo "building for ${BUILDKITE_AGENT_META_DATA_ARCH}"
  buildah bud -t $VERSIONED_IMAGE amd64.Dockerfile
fi

#mkdir -p bin
#FN="./bin/${PRODUCT_NAME}.tar"
echo "pushing ${VERSIONED_IMAGE}"
#buildah push $IMAGE "docker-archive:${FN}:${VERSIONED_IMAGE}"
buildah push "--creds=$DOCKER_USER:$DOCKER_PASS" $VERSIONED_IMAGE
