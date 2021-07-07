#!/bin/bash

mkdir -p dist
rm -rf dist/*

pushd src
mkdir -p ../dist/makerverse/
cp -af package.json ../dist/makerverse/
cross-env NODE_ENV=production babel "*.js" \
    --config-file ../babel.config.js \
    --out-dir ../dist/makerverse
cross-env NODE_ENV=production babel "electron-app/**/*.js" \
    --config-file ../babel.config.js \
    --out-dir ../dist/makerverse/electron-app
popd
