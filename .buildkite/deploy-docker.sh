#!/usr/bin/env sh

IMAGE="${DOCKER_REPO}:${DOCKER_BUILD_TAG}"
MANIFEST="${DOCKER_PUBLIC_REGISTRY}/${IMAGE}"

echo "Creating $MANIFEST ..."
buildah manifest rm $MANIFEST
buildah manifest create $MANIFEST

function addToManifest() {
  VERSIONED_IMAGE="${DOCKER_LOCAL_REGISTRY}/${DOCKER_REPO}:${1}-${BUILDKITE_BUILD_NUMBER}"
  PUBLIC_IMAGE="${DOCKER_PUBLIC_REGISTRY}/${DOCKER_REPO}:${DOCKER_BUILD_TAG}-${1}"

  echo "Converting ${VERSIONED_IMAGE} to ${PUBLIC_IMAGE}..."
  buildah pull $VERSIONED_IMAGE
  buildah tag $VERSIONED_IMAGE $PUBLIC_IMAGE
  buildah push "--creds=$DOCKER_USER:$DOCKER_PASS" "${PUBLIC_IMAGE}"

  if [[ -z "$2" ]]; then
    buildah manifest add $MANIFEST $PUBLIC_IMAGE
  else
    buildah manifest add --arch ${2} --variant ${3} $MANIFEST $PUBLIC_IMAGE
  fi
}

addToManifest amd64
addToManifest arm32v7 arm v7
addToManifest arm64v8 arm v8

buildah manifest push $MANIFEST "--creds=$DOCKER_USER:$DOCKER_PASS" "docker://$MANIFEST"

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
