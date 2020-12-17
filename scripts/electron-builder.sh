-#!/bin/bash

__dirname="$(CDPATH= cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
root="${__dirname}/../"
output="${root}output"
releases="${root}releases"
semver=$(./scripts/semver.sh)
vers=`git describe --tags --abbrev=0`

PRODUCT_NAME=Makerverse
PACKAGE_NAME=`node -e "console.log(require('${root}/src/package.json').name)"`
PACKAGE_VERSION=`node -e "console.log(require('${root}/src/package.json').version)"`
PUBLIC_VERSION=`echo $PACKAGE_VERSION | sed 's/-\(.*\)//'`
echo "Starting Electron build of ${PACKAGE_NAME} v${PUBLIC_VERSION} (${PACKAGE_VERSION})..."

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
if [ ! -z "$CI_VERSION" ]; then
  # Force rebuild modules on CI
  echo "Cleaning up \"`pwd`/node_modules\""
  rm -rf node_modules
fi
echo "Installing packages..."
npm install --production
npm dedupe
popd

echo "Rebuild native modules using electron ${electron_version}"
npm run electron-rebuild -- \
    --version=${electron_version:1} \
    --module-dir=dist/makerverse \
    --which-module=serialport

# Run the Electron builder.
mkdir -p "$releases"
cross-env USE_HARD_LINKS=false npm run electron-builder -- "$@"

# Bundle the release into the ./releases directory
copy_release_file() {
  fp="$output/${1}.${3}"
  if [[ ! -f "$fp" ]]; then
    echo "ERROR: Release file missing: $fp"
    exit 1
  else
    pn="makerverse-app-${2}-${vers}.${3}"
    echo "$pn"
    cp "$fp" "${releases}/${pn}"
  fi
}

compress_release_dir() {
  pushd "$releases"
  s="${1}"
  n="${2}"
  ln -sf "../output/${s}" "${PACKAGE_NAME}-${n}"
  tar zcfh "${PACKAGE_NAME}-${n}-${vers}.tar.gz" "${PACKAGE_NAME}-${n}"
  rm -f "${PACKAGE_NAME}-${n}"
  popd
}

echo "--- Output Directory ---"
pushd "$output"
ls -la .
popd

if [ "$1" = "--linux" ]; then
  echo "--- Linux bundle ---"
  if [ "$2" = "--ia32" ]; then
    copy_release_file "${PRODUCT_NAME}-${semver}-i386" "linux-i386" "AppImage"
    copy_release_file "${PACKAGE_NAME}_${semver}_i386" "linux-i386" "deb"
    copy_release_file "${PACKAGE_NAME}-${semver}.i686" "linux.i686" "rpm"
    compress_release_dir "linux-ia32-unpacked" "linux-ia32"
  elif [ "$2" = "--x64" ]; then
    copy_release_file "${PRODUCT_NAME}-${semver}" "linux-x86_64" "AppImage"
    copy_release_file "${PACKAGE_NAME}_${semver}_amd64" "linux-amd64" "deb"
    copy_release_file "${PACKAGE_NAME}-${semver}.x86_64" "linux.x86_64" "rpm"
    compress_release_dir "linux-unpacked" "linux-x64"
  else
    echo "Unknown architecture: $2"
  fi
elif [ "$1" = "--mac" ]; then
  echo "--- Mac bundle ---"
  copy_release_file "${PRODUCT_NAME}-${semver}" "macos" "pkg"
  # copy_release_file "${PRODUCT_NAME}-${semver}" "macos" "dmg"
elif [ "$1" = "--win" ]; then
  echo "--- Windows bundle ---"
  copy_release_file "${PRODUCT_NAME} Setup ${semver}" "windows" "exe"
else
  echo "Unknown platform: $1"
  exit 1
fi
