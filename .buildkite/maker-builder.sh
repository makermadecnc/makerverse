#!/usr/bin/env bash
set -euo pipefail
CMD="${1:-build}"
shift

EXE="${CMD} $@"
echo "$EXE"
node -e "require('@openworkshop/maker-builder/src/${EXE}');"
