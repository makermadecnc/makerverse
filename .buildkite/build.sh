#!/usr/bin/env bash

VERSIONED_IMAGE="${DOCKER_REPO}:${BUILDKITE_AGENT_META_DATA_ARCH}-${BUILDKITE_BUILD_NUMBER}"
echo "building for ${BUILDKITE_AGENT_META_DATA_ARCH}"
buildah bud -t $VERSIONED_IMAGE .

#mkdir -p bin
#FN="./bin/${PRODUCT_NAME}.tar"
echo "pushing ${VERSIONED_IMAGE}"
#buildah push $IMAGE "docker-archive:${FN}:${VERSIONED_IMAGE}"
buildah push "--creds=$DOCKER_USER:$DOCKER_PASS" $VERSIONED_IMAGE
