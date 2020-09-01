#!/bin/bash
version=${1:-`git describe --tags --abbrev=0`}

if [ -z "$TRAVIS_PULL_REQUEST_BRANCH" ]; then
  branch=${TRAVIS_BRANCH:-dev}
else
  branch="$TRAVIS_PULL_REQUEST_BRANCH"
fi

build=""
if [ ! -z "$TRAVIS_BUILD_NUMBER" ]; then
  build=".${TRAVIS_BUILD_NUMBER}"
fi

echo "${version}-${branch}${build}"
