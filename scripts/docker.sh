#!/bin/bash
set -e pipefail

# https://medium.com/@quentin.mcgaw/cross-architecture-docker-builds-with-travis-ci-arm-s390x-etc-8f754e20aaef

BUILD_PLATFORMS=${DOCKER_BUILD_PLATFORMS:-linux/amd64,linux/arm64,linux/arm/v7}
DOCKER_REPO="makerverse/core"

if [ "$TRAVIS_PULL_REQUEST" = "false" ] && [ "$TRAVIS_BRANCH" = "master" ]; then
  if [ "$1" != "deploy" ]; then
    # Master branch has a deploy step. Others use the build as the deploy.
    echo "Skipping Docker build until deploy step."
    exit 0
  fi
  TAG="latest"
else
  if [ "$TRAVIS_BRANCH" = "master" ]; then
    TAG="ci"
  else
    TAG="${TRAVIS_BRANCH}"
  fi
fi

echo "Building $DOCKER_REPO:$TAG for $BUILD_PLATFORMS"

# Login to Docker
echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

echo "Logged in to Docker."

# n.b., this ALWAYS pushes the resulting image. This is because the --load flag does not
# support multi-arch. https://github.com/docker/buildx/issues/59
if [[ ! -z "$CI_VERSION" ]]; then
  docker buildx build --push "--platform=$BUILD_PLATFORMS" -t "$DOCKER_REPO:$TAG" -t "$DOCKER_REPO:v$CI_VERSION" .
else
  docker buildx build --push "--platform=$BUILD_PLATFORMS" -t "$DOCKER_REPO:$TAG" .
fi

if [ $? -eq 0 ]; then
  echo "Docker build succeded."
else
  exit 1
fi
