@echo off
ECHO "maker-$@"
SET PATH=C:\Program Files\nodejs;%PATH%
SET CMD=%1
shift

echo "[MB] maker-%CMD% $@"
npm install -g "@openworkshop/maker-builder@latest"

yarn exec "maker-%CMD%" -- $@
