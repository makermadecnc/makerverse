#!/usr/bin/env bash

VERSIONED_IMAGE="${DOCKER_REPO}:b${BUILDKITE_BUILD_NUMBER}"
IMAGE="${DOCKER_REPO}:${DOCKER_BUILD_TAG}"
echo "Retagging ${VERSIONED_IMAGE} as ${IMAGE}"
buildah pull "docker.io/${VERSIONED_IMAGE}"
buildah tag ${VERSIONED_IMAGE} ${IMAGE}

echo "Pushing ${IMAGE}"
buildah push "--creds=$DOCKER_USER:$DOCKER_PASS" $IMAGE

#buildkite-agent artifact download bin/* bin/
#FN="./bin/${PRODUCT_NAME}.tar"

# buildah pull docker.io/openworkshop/ows:dev
# buildah login -u $DOCKER_USER -p $DOCKER_PASS docker.com

#if [[ ! -f $FN ]]; then
#  echo "Missing artifact: ${FN}"
#  exit 1
#fi
#tar -xf "$FN"
#ls -la