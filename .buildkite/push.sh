#!/usr/bin/env bash

ARM7_IMAGE="${DOCKER_REPO}:arm32v7-${BUILDKITE_BUILD_NUMBER}"
ARM8_IMAGE="${DOCKER_REPO}:arm64v8-${BUILDKITE_BUILD_NUMBER}"
AMD64_IMAGE="${DOCKER_REPO}:amd64-${BUILDKITE_BUILD_NUMBER}"
IMAGE="${DOCKER_REPO}:${DOCKER_BUILD_TAG}"

MANIFEST="$IMAGE"
buildah manifest create $MANIFEST

echo "Adding ${AMD64_IMAGE} to ${MANIFEST}"
buildah pull "docker.io/${AMD64_IMAGE}"
buildah manifest add $MANIFEST ${AMD64_IMAGE}

echo "Adding ${ARM7_IMAGE} to ${MANIFEST}"
buildah pull "docker.io/${ARM7_IMAGE}"
buildah manifest add --arch arm --variant v7 $MANIFEST ${ARM7_IMAGE}

echo "Adding ${ARM8_IMAGE} to ${MANIFEST}"
buildah pull "docker.io/${ARM8_IMAGE}"
buildah manifest add --arch arm --variant v8 $MANIFEST ${ARM8_IMAGE}

buildah manifest push $MANIFEST "--creds=$DOCKER_USER:$DOCKER_PASS" "docker://docker.io/$MANIFEST"

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
