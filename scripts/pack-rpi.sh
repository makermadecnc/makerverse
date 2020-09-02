#!/bin/bash
set -eo pipefail
vers=`git describe --tags --abbrev=0`

edition="$1"
if [ "$edition" = "full" ]; then
  name="Raspbian (Full)"
else
  name="Raspbian (Lite)"
  edition="lite"
fi

if [[ ! -z "$CI_SEMVER" ]]; then
  if [ "$TRAVIS_PULL_REQUEST" = "false" ] && [ "$TRAVIS_BRANCH" = "master" ]; then
    echo "Building ${name} v${vers}"
  else
    echo "Skipping building ${name} until deployment."
    exit 0
  fi
fi
cf="raspbian-${edition}.json"

mkdir -p "output"
docker run --rm --privileged -v /dev:/dev -v ${PWD}:/build \
  mkaczanowski/packer-builder-arm build "ci/$cf"

of="output/raspbian-${edition}.img"
if [ ! -f "$of" ]; then
  echo "Failed to generate $of"
  exit 1
fi

if [ ! -z "$CI_SEMVER" ]; then
  # On the CI, run pishrink to compress the upload.
  mkdir -p "releases"
  sudo scripts/pishrink.sh -z "$of" "releases/makerverse-raspbian-${edition}-${vers}.img"
fi
