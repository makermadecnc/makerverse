#!/bin/bash
sv=$(./scripts/semver.sh)

echo "Setting app version to ${sv}..."
npm version "$sv" --allow-same-version --no-git-tag-version
pushd src
npm version "$sv" --allow-same-version --no-git-tag-version
popd
