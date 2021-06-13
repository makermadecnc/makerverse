#!/usr/bin/env bash
ELECTRON_TARGET="${1:-linux}"

echo "Adding required build tools..."
cd WebApp
yarn add electron-builder --dev
yarn insntall
cd ..

echo "Electron build for $ELECTRON_TARGET"
dotnet restore

which node
electronize build /target $ELECTRON_TARGET
