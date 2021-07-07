@echo off
ECHO "[MB] maker-%*"
SET NPM_PATH=%APPDATA%\npm
SET PATH=C:\Program Files\Git\usr\bin;C:\Program Files\nodejs;%NPM_PATH%\npm;%PATH%
SET MB_SRC=src\maker-builder

if exist "%MB_SRC%" (
  ECHO "[MB] remove old installation..."
  CALL npm uninstall -g "@openworkshop/maker-builder"

  ECHO "[MB] install dependencies..."
  CD "%MB_SRC%"
  CALL yarn install

  ECHO "[MB] install new package..."
  CD "..\..\"
  CALL npm install -g --force "%MB_SRC%"

  ECHO "[MB] verify installation..."
  CALL npm cache verify
  SET MB_INSTALLED=true
  SET MB_LOCAL=true
) else (
  ECHO "[MB] install global package..."
  CALL npm install -g "@openworkshop/maker-builder@latest"
  SET MB_INSTALLED=true
  SET MB_LOCAL=false
)

CALL "%NPM_PATH%\\maker-env" "--version"
CALL "%NPM_PATH%\\maker-env" "prep"

CALL "%NPM_PATH%\\maker-%1" %2 %3 %4 %5 %6 %7 %8 %9
if "%ERRORLEVEL%" == "1" exit /B 1
