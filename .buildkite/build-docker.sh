#!/usr/bin/env bash
buildah rm -all

if [[ -z "$1" ]]; then
  ARCH=${BUILDKITE_AGENT_META_DATA_ARCH:-amd}
else
  ARCH="$1"
fi

CPU="${BUILDKITE_AGENT_META_DATA_CPU:-64}"
ARCH_VARIANT="${BUILDKITE_AGENT_META_DATA_ARCH_VARIANT:-x64}"

VERSIONED_IMAGE="${DOCKER_LOCAL_REGISTRY}/${DOCKER_REPO}:${ARCH}-${BUILDKITE_BUILD_NUMBER}"

if [[ $ARCH == "arm" ]]; then
  ARCH_FULL="${ARCH}${CPU}${ARCH_VARIANT}"

  echo "building $ARCH_FULL"
  buildah bud --arch arm --variant "$ARCH_VARIANT" \
    --build-arg YARN_REGISTRY="$NPM_LOCAL_REGISTRY" \
    --build-arg DOCKER_REGISTRY="$DOCKER_LOCAL_REGISTRY" \
    --build-arg DOTNET_RUNTIME="buster-slim-${ARCH_FULL}" \
    --build-arg DOTNET_SDK="5.0-arm" \
    -t "$VERSIONED_IMAGE" Dockerfile
else
  echo "building for ${ARCH} ${ARCH_VARIANT}"
  buildah bud \
    --build-arg YARN_REGISTRY="$NPM_LOCAL_REGISTRY" \
    --build-arg DOCKER_REGISTRY="$DOCKER_LOCAL_REGISTRY" \
    -t "$VERSIONED_IMAGE" Dockerfile
fi

#mkdir -p bin
#FN="./bin/${PRODUCT_NAME}.tar"
echo "pushing ${VERSIONED_IMAGE}"
#buildah push $IMAGE "docker-archive:${FN}:${VERSIONED_IMAGE}"
# "--creds=$DOCKER_USER:$DOCKER_PASS"
buildah push "$VERSIONED_IMAGE"
