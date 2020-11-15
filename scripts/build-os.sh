#!/bin/bash
set -eo pipefail
vers=`git describe --tags --abbrev=0`

if [ "$IS_MASTER_RELEASE" = "true" ]; then
  echo "Building ${1} v${vers}"
else
  echo "Skipping building ${1} until deployment."
  exit 0
fi

yarn run build-latest
yarn run "build:${1}"

if [ ! -z "$2" ]; then
  yarn run "build:${2}"
fi
