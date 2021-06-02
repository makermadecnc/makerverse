#!/usr/bin/env bash


ARM_IMAGE="${DOCKER_REPO}:arm64v8-${BUILDKITE_BUILD_NUMBER}"
AMD64_IMAGE="${DOCKER_REPO}:amd64-${BUILDKITE_BUILD_NUMBER}"
IMAGE="${DOCKER_REPO}:${DOCKER_BUILD_TAG}"

echo "Retagging arm64v8 + amd64 as ${IMAGE}"
buildah pull "docker.io/${ARM_IMAGE}"
buildah pull "docker.io/${AMD64_IMAGE}"

# Create new manifest
buildah manifest create Makerverse
buildah manifest add Makerverse ${AMD64_IMAGE}
buildah manifest add Makerverse ${ARM_IMAGE}
buildah manifest push Makerverse "--creds=$DOCKER_USER:$DOCKER_PASS" $IMAGE

#buildah tag ${VERSIONED_IMAGE} ${IMAGE}

#echo "Pushing ${IMAGE}"
#buildah push "--creds=$DOCKER_USER:$DOCKER_PASS" $IMAGE

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
