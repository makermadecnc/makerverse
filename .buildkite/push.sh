#!/usr/bin/env bash

ARM7_IMAGE="${DOCKER_REPO}:arm32v7-${BUILDKITE_BUILD_NUMBER}"
ARM8_IMAGE="${DOCKER_REPO}:arm64v8-${BUILDKITE_BUILD_NUMBER}"
AMD64_IMAGE="${DOCKER_REPO}:amd64-${BUILDKITE_BUILD_NUMBER}"
IMAGE="${DOCKER_REPO}:${DOCKER_BUILD_TAG}"

MANIFEST="$IMAGE"
buildah manifest create $MANIFEST

function addToManifest() {
  echo "Adding ${1} to ${MANIFEST} ($2 $3)"
  buildah pull "${REGISTRY_LOCAL}/${1}"
  if [[ -z "$2" ]]; then
    buildah manifest add $MANIFEST ${1}
  else
    buildah manifest add --arch ${2} --variant ${3} $MANIFEST ${1}
  fi
}

addToManifest $AMD64_IMAGE
addToManifest $ARM7_IMAGE arm v7
addToManifest $ARM7_IMAGE arm v8

buildah manifest push $MANIFEST "--creds=$DOCKER_USER:$DOCKER_PASS" "docker://${REGISTRY_PUBLIC}/${MANIFEST}"

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
