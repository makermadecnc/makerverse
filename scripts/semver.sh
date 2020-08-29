#!/bin/bash
tag=${1:-`git describe --tags`}
version=`echo $tag | sed 's/-\(.*\)//'`

if [ -z "$TRAVIS_PULL_REQUEST_BRANCH" ]; then
  branch=${TRAVIS_BRANCH:-latest}
else
  branch="$TRAVIS_PULL_REQUEST_BRANCH"
fi

build=""
if [ ! -z "$TRAVIS_BUILD_NUMBER" ]; then
  build=".${TRAVIS_BUILD_NUMBER}"
fi

echo "${version}-${branch}${build}"
