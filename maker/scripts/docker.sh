#!/bin/bash
set -eo pipefail

# https://medium.com/@quentin.mcgaw/cross-architecture-docker-builds-with-travis-ci-arm-s390x-etc-8f754e20aaef

BUILD_PLATFORMS=${DOCKER_BUILD_PLATFORMS:-linux/amd64,linux/arm64,linux/arm/v7}
DOCKER_REPO="makerverse/core"

echo "Docker '$@' for $BUILD_PLATFORMS"

TAG2=""

if [ "$IS_MASTER_RELEASE" = "true" ]; then
  if [ "$1" = "build" ]; then
    # Master branch has a deploy step. Others use the build as the deploy.
    echo "Skipping Docker build until Deploy step on master branch."
    exit 0
  fi
  if [[ $(echo $CI_VERSION | grep '-') ]]; then
    # Prerelease venrsions have a feature branch
    TAG="prerelease"
  else
    TAG="latest"
    TAG2="prerelease"
  fi
else
  if [ "$TRAVIS_BRANCH" = "master" ]; then
    TAG="ci"
  else
    TAG="${TRAVIS_BRANCH}"
  fi
fi

echo "Docker building $DOCKER_REPO:$TAG"

# Login to Docker
echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

echo "Logged in to Docker."

# n.b., this ALWAYS pushes the resulting image. This is because the --load flag does not
# support multi-arch. https://github.com/docker/buildx/issues/59
if [[ ! -z "$CI_VERSION" ]]; then
  if [[ -z "$TAG2" ]]; then
    docker buildx build --push "--platform=$BUILD_PLATFORMS" -t "$DOCKER_REPO:$TAG" -t "$DOCKER_REPO:v$CI_VERSION" .
  else
    docker buildx build --push "--platform=$BUILD_PLATFORMS" -t "$DOCKER_REPO:$TAG" \
      -t "$DOCKER_REPO:$TAG2" -t "$DOCKER_REPO:v$CI_VERSION" .
  fi
else
  if [[ -z "$TAG2" ]]; then
    docker buildx build --push "--platform=$BUILD_PLATFORMS" -t "$DOCKER_REPO:$TAG" .
  else
    docker buildx build --push "--platform=$BUILD_PLATFORMS" -t "$DOCKER_REPO:$TAG" -t "$DOCKER_REPO:$TAG2" .
  fi
fi

if [ $? -eq 0 ]; then
  echo "Docker build succeded."
else
  exit 1
fi
