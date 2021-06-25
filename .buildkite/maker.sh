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

function installMbFromSource() {
  echo "[INSTALL] from $1"
  pushd "$1"
  yarn install
  npm install -g ./
  popd
}

function installMb() {
  echo "[INSTALL] from @openworkshop/maker-builder@latest"
  npm install -g "@openworkshop/maker-builder@latest"
}

# Install @openworkshop/maker-builder
if [[ -f "./src/maker-builder/package.json" ]]; then
  # In main repository, where source is contained, always reinstall from source to get latest changes.
  installMbFromSource ./src/maker-builder
elif [[ ! -z "$CI" ]]; then
  # Always install latest in CI env
  installMb
else
  # In dev,
  if ! type "maker-env" > /dev/null; then
    # only install latest if not present
    installMb
  fi
fi

# Print version & run commands.
yarn exec maker-env -- --version
echo "[MB] maker-$CMD $@"
yarn exec "maker-$CMD" -- $@
