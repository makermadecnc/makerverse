#!/usr/bin/env bash

VERSIONED_IMAGE="${DOCKER_REPO}:${BUILDKITE_AGENT_META_DATA_ARCH}-${BUILDKITE_BUILD_NUMBER}"
echo "building for ${BUILDKITE_AGENT_META_DATA_ARCH}"

if [[ $BUILDKITE_AGENT_META_DATA_ARCH == "arm64v8" ]]; then
  buildah bud --arch arm --variant v8 -t $VERSIONED_IMAGE .
elif [[ $BUILDKITE_AGENT_META_DATA_ARCH == "arm32v7" ]]; then
  buildah bud --arch arm --variant v7 -t $VERSIONED_IMAGE .
else
  buildah bud -t $VERSIONED_IMAGE .
fi

#mkdir -p bin
#FN="./bin/${PRODUCT_NAME}.tar"
echo "pushing ${VERSIONED_IMAGE}"
#buildah push $IMAGE "docker-archive:${FN}:${VERSIONED_IMAGE}"
buildah push "--creds=$DOCKER_USER:$DOCKER_PASS" $VERSIONED_IMAGE
