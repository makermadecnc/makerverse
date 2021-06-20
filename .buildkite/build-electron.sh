#!/bin/bash
set -euo pipefail

source .buildkite/bootstrap.sh
printenv

ELECTRON_TARGET="${1:-linux}"

echo "Checking dotnet version..."
dotnet --version

echo "Setting NPM/yarn registry to $NPM_LOCAL_REGISTRY..."
yarn config set registry "$NPM_LOCAL_REGISTRY"
npm config set registry "$NPM_LOCAL_REGISTRY"

# yarn global add electron-builder npx npm
npm install -g npm npx

if [[ "$(cd WebApp)" ]]; then
  echo "Installing yarn packages..."
  npm install
  cd ..
else
  echo "Could not install yarn"
  pwd
  ls -la
fi

# echo "Restoring dotnet..."
# dotnet restore


echo "Building electron target: $ELECTRON_TARGET"
electronize build /target "$ELECTRON_TARGET"

