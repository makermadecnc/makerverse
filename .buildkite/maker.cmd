@echo off
ECHO "maker-$@"
SET NPM_PATH=%APPDATA%\npm
SET PATH=C:\Program Files\nodejs;%NPM_PATH%\npm;%PATH%

SET
ECHO "[MB] maker-%*"
CALL npm install -g "@openworkshop/maker-builder@latest"

CALL "%NPM_PATH%\\maker-%1" %2 %3 %4 %5 %6 %7 %8 %9
if "%ERRORLEVEL%" == "1" exit /B 1

