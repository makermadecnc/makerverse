#!/bin/bash
# Uses git commit history to generate release notes
# Arg $1 = the prior version tag to compare against
ov=${1:-1.0.6}
nv=$(git describe --tags --abbrev=0)
echo "Changes since ${ov}:"
log=$(git log ${ov}..HEAD --pretty=format:"%s"  | grep -i -E "^(\[INTERNAL\]|\[FEATURE\]|\[FIX\]|\[DOC\])*\[FEATURE\]")
echo $log
