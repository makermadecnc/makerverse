#!/bin/bash
SRC=${1}
DST="${2}"

echo "Copy build from $SRC to $DST ..."
mkdir -p "${DST}"
# cp -r "${SRC}/src" "${DST}/src"
# cp -r "${SRC}/dist" "${DST}/dist"
# cp -r "${SRC}/node_modules" "${DST}/node_modules"
# cp -r "${SRC}/scripts" "${DST}/scripts"
# cp -r "${SRC}/static" "${DST}/static"
# cp -r "${SRC}/bin" "${DST}/bin"
# cp -r "${SRC}/webpack.*" "${DST}/"
# cp -r "${SRC}/package*" "${DST}/"

cp -r "${SRC}/" "${DST}"
echo "done."
