#!/bin/bash
# https://medium.com/@quentin.mcgaw/cross-architecture-docker-builds-with-travis-ci-arm-s390x-etc-8f754e20aaef

BUILD_PLATFORMS=${DOCKER_BUILD_PLATFORMS:-linux/amd64,linux/arm64}
echo "TRAVIS_BRANCH=$TRAVIS_BRANCH"

DOCKER_REPO=skilescm/makerverse

echo "Pass: $DOCKER_PASS"
echo "User: $DOCKER_USER"
echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin &> /dev/null

if [ "$TRAVIS_BRANCH" != "master" ]; then
  TAG="${TRAVIS_TAG:-ci}"
else
  TAG="${TRAVIS_TAG:-latest}"
fi

FLAG="--load"

if [ "$1" = "push" ] || [ "$TRAVIS_BRANCH" != "master" ]; then
  FLAG="--push"
fi

if [[ -z "$TRAVIS_TAG" ]]; then
  npm run build-latest
else
  npm run build
fi

docker buildx build "$FLAG" "--platform=$BUILD_PLATFORMS" -t "$DOCKER_REPO:$TAG" .
