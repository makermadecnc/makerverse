#!/bin/bash
mkdir -p rpi
vers=`git describe --tags --abbrev=0`

edition="$1"
if [ "$edition" = "full" ]; then
#   fn="raspbian-full.zip"
#   url="https://downloads.raspberrypi.org/raspios_armhf_latest"
#   match="rpi/*-full.img"
  echo "Raspbian (Full)"
else
#   fn="raspbian-lite.zip"
#   url="https://downloads.raspberrypi.org/raspios_lite_armhf_latest"
#   match="rpi/*-lite.img"
  echo "Raspbian (Lite)"
  edition="lite"
fi
cf="raspbian-${edition}.json"

mkdir -p "output"
docker run --rm --privileged -v /dev:/dev -v ${PWD}:/build \
  mkaczanowski/packer-builder-arm build "ci/$cf" -extra-system-packages=unzip

of="output/raspbian-${edition}.img"
if [ ! -f "$of" ]; then
  echo "Failed to generate $of"
  exit 1
fi

mkdir -p "releases"

if [ ! -z "$CI_SEMVER" ]; then
  # On the CI, run pishrink to compress the upload.
  ls -la "$of"
  sudo scripts/pishrink.sh -z "$of" "releases/makerverse-raspbian-${edition}-${vers}.img.zip"
fi

# rm -rf "${match}"

# fd="$(pwd)/rpi/$fn"
# if [ ! -f "$fd" ]; thenu
#   echo "Downloading $fn"
#   wget -O "$fd" "$url"
# fi

# echo "Unzipping $fd"
# pushd rpi
# unzip "$fn"
# popd
# img="$(pwd)/$(ls ${match})"

# if [ ! -f "$img" ]; then
#   echo "Failed to get img from $url"
#   exit 1
# fi

# echo "Using imge: $img"
# ./scripts/rpi-img-install.sh "$(pwd)" "$img"

# ./scripts/pishrink.sh
# mv "$img" "releases/makerverse-raspbian-${semver}.zip"

# gzip -9 /your/path/to/clone-shrink.img
