#!/usr/bin/env bash
ELECTRON_TARGET="${1:-linux}"

echo "Adding required build tools..."
yarn global add electron-builder

echo "Electron build for $ELECTRON_TARGET"
dotnet restore

which node
electronize build /target $ELECTRON_TARGET
