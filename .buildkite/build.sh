#!/usr/bin/env bash

VERSIONED_IMAGE="${DOCKER_REPO}:b${BUILDKITE_BUILD_NUMBER}"
buildah bud -t $VERSIONED_IMAGE ci/amd64.Dockerfile

#mkdir -p bin
#FN="./bin/${PRODUCT_NAME}.tar"
echo "building ${VERSIONED_IMAGE}"
#buildah push $IMAGE "docker-archive:${FN}:${VERSIONED_IMAGE}"
buildah push "--creds=$DOCKER_USER:$DOCKER_PASS" $VERSIONED_IMAGE
