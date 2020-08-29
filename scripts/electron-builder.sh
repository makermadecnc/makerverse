#!/bin/bash

__dirname="$(CDPATH= cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="${__dirname}/../"
output="${root}/output"
releases="${root}/releases"
vers="-${CI_SEMVER}"

PACKAGE_NAME=`node -e "console.log(require('${root}/src/package.json').name)"`
PACKAGE_VERSION=`node -e "console.log(require('${root}/src/package.json').version)"`
echo "Starting Electron build of ${PACKAGE_NAME} v${PACKAGE_VERSION}..."

electron_version=$(electron --version)

display_usage() {
    npm run electron-builder -- --help
}

if [ $# -le 1 ]; then
    display_usage
    exit 1
fi

if [[ ( $# == "--help") ||  $# == "-h" ]]; then
    display_usage
    exit 0
fi

pushd "$__dirname/../dist/makerverse"
echo "Cleaning up \"`pwd`/node_modules\""
rm -rf node_modules
echo "Installing packages..."
npm install --production
npm dedupe
popd

echo "Rebuild native modules using electron ${electron_version}"
npm run electron-rebuild -- \
    --version=${electron_version:1} \
    --module-dir=dist/makerverse \
    --which-module=serialport

cross-env USE_HARD_LINKS=false npm run electron-builder -- "$@"

# Bundle the release into the ./releases directory
copy_release_file() {
  if [[ ! -f "$1" ]]; then
    echo "ERROR: Release file missing: $1"
    exit 1
  else
    cp "$1" "${releases}/"
  fi
}

mkdir -p "$releases"
if [ "$1" = "--linux" ]; then
  echo "--- Linux bundle ---"
elif [ "$1" = "--mac" ]; then
  echo "--- Mac bundle ---"
  copy_release_file "Makerverse-${PACKAGE_VERSION}.pkg"
  copy_release_file "Makerverse-${PACKAGE_VERSION}.dmg"
elif [ "$1" = "--win" ]; then
  echo "--- Windows bundle ---"
  echo "$2"
else
  echo "Unknown platform: $1"
  exit 1
fi
