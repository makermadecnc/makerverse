@echo off
ECHO Bootstrapping...
SET PATH=C:\Program Files\nodejs;%PATH%
SET "BUILD_ELECTRON=true"
SET "LOCAL_DOMAIN=oodalolly.camp"
SET "NPM_LOCAL_REGISTRY=https://npm.%LOCAL_DOMAIN%"

ECHO Checking dotnet...
dotnet --version

ECHO "Setting NPM/yarn registry to %NPM_LOCAL_REGISTRY%..."
rem call yarn config set registry "%NPM_LOCAL_REGISTRY%"
call npm config set registry "%NPM_LOCAL_REGISTRY%"

call npm install -g npx electron-builder

ECHO "Installing yarn packages..."
cd WebApp
call npm install
cd ..

ECHO "Building Electron Windows target..."
set
electronize build /target win
if "%ERRORLEVEL%" == "1" exit /B 1
