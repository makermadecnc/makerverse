#!/bin/bash
set -eo pipefail
vers=`git describe --tags --abbrev=0`

edition="$1"
if [ "$edition" = "desktop" ]; then
  name="Raspbian (Desktop)"
  edition="desktop"
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

# Enable or disable prereleases by editing the config file directly
prereleases="false"
if [[ $(echo $CI_VERSION | grep '-') ]]; then
  prereleases="true"
fi
mvfn="./.makerverse.docker"
echo "Setting prereleases = ${prereleases} in ${mvfn}"
sed -i "s/\"prereleases\": true/\"prereleases\": ${prereleases}/g" $mvfn
sed -i "s/\"prereleases\": false/\"prereleases\": ${prereleases}/g" $mvfn

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
  sudo scripts/pishrink.sh -z "$of" "releases/makerverse-raspberry-pi-os-${edition}-${vers}.img"
fi
