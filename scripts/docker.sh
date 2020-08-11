#!/bin/bash
# https://medium.com/@quentin.mcgaw/cross-architecture-docker-builds-with-travis-ci-arm-s390x-etc-8f754e20aaef

BUILD_PLATFORMS=${DOCKER_BUILD_PLATFORMS:-linux/amd64,linux/arm64}
echo "TRAVIS_BRANCH=$TRAVIS_BRANCH"

DOCKER_REPO=skilescm/makerverse

echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin &> /dev/null

if [ "$TRAVIS_BRANCH" != "master" ]; then
  TAG="${TRAVIS_TAG:-ci}"
else
  TAG="${TRAVIS_TAG:-latest}"
fi

docker buildx build \
  --progress plain \
  "--platform=$BUILD_PLATFORMS" \
  -t "$DOCKER_REPO:$TAG" \
  .

if [ "$1" = "push" ] || [ "$TRAVIS_BRANCH" != "master" ]; then
  docker push "$DOCKER_REPO:$TAG"
fi
