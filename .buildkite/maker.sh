#!/usr/bin/env bash
# Usage:
# curl -s https://raw.githubusercontent.com/OpenWorkShop/MakerHub/master/src/maker-builder/scripts/builder-entrypoint.sh \
#   | bash env generate
set -euo pipefail

CMD="${1}"
if [[ -z "$CMD" ]]; then
  echo "No command!"
  exit 1
fi
shift

echo "[MB] maker-$CMD $@"

# Setup
if [[ -d "./src/maker-builder" ]]; then
  pushd ./src/maker-builder
  yarn install
  npm install -g ./
  popd
else
  npm install -g "@openworkshop/maker-builder@latest"
fi

echo "[MB] v. $(yarn exec maker-electron -- --version)"

yarn exec "maker-$CMD" -- $@
