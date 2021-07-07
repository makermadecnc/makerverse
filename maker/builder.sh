#!/usr/bin/env bash
# This script should be copied into the host machine's scripts/CI directory.
set -euo pipefail

## Deduce the maker file path
DIR="$(cd "$(dirname "$0")"; pwd)"
FN="$(basename "$0")"
export MAKER="${DIR}/${FN}"
#alias maker="${MAKER}"
echo "[MB] ${MAKER}"

# Set up defaults.
CMD="${1:-}"
CI="${CI:-false}"
MB_INSTALLED="${MB_INSTALLED:-}"

if [[ -z "$CMD" ]]; then
  echo "No command!"
  exit 1
fi
shift

function installMbFromSource() {
  if [[ -z "$MB_INSTALLED" ]]; then
    echo "[INSTALL] dependencies in $1"
    npm uninstall -g "@openworkshop/maker-builder"
    pushd "$1"
    # This is f*gly, but it gives us globals
    rm -rf node_modules
    yarn install
    popd
    echo "[INSTALL] global $1"
    npm install -g --force "$1"
    npm cache verify
    export MB_INSTALLED="true"
  fi
}

function installMb() {
  echo "[INSTALL] from @openworkshop/maker-builder@latest"
  npm install -g "@openworkshop/maker-builder@latest"
  export MB_INSTALLED="true"
}

# Install @openworkshop/maker-builder
if [[ -f "./src/maker-builder/package.json" ]]; then
  # In main repository, where source is contained, always reinstall from source to get latest changes.
  installMbFromSource ./src/maker-builder
elif [[ -n "$CI" ]]; then
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
yarn exec maker-env -- prep # Ensure CI has the correct version.

ENVF=".env"
if [[ -f "${ENVF}" ]]; then
  echo "[MB] loading env file..."
  set -o allexport; source "${ENVF}"; set +o allexport

  # Print out the env, filtered to relevant vars
  printenv | grep "MAKER_HUB"
fi

echo "[MB] maker-$CMD $*"
yarn exec "maker-$CMD" -- "$@"
