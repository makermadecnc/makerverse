#!/bin/bash
printenv
source .buildkite/bootstrap.sh

echo "Bootstrapped"
printenv

ELECTRON_TARGET="${1:-linux}"

echo "Checking dotnet version..."
dotnet --version

echo "Setting yarn registry to $NPM_LOCAL_REGISTRY..."
yarn config set registry $NPM_LOCAL_REGISTRY

echo "Electron build for $ELECTRON_TARGET"
dotnet restore

which node
electronize build /target "$ELECTRON_TARGET"
