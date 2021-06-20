#!/bin/bash
ELECTRON_TARGET="${1:-linux}"

# Dotnet
export DOTNET_ROOT=$HOME/dotnet
export PATH=$PATH:$DOTNET_ROOT:$HOME/.dotnet/tools

if [ ! $(which dotnet) ]; then
  echo "Installing Dotnet..."
  mkdir -p $HOME/dotnet
  tar zxf /assets/dotnet-sdk-5.0.300-linux-x64.tar.gz -C "$DOTNET_ROOT"
fi

echo "Checking dotnet version..."
dotnet --version

# Electronize
if [ ! $(which electronize) ]; then
  dotnet tool install ElectronNET.CLI -g
fi

# Load NVM if present
export NVM_DIR="$HOME/.nvm"
if [[ -f "$NVM_DIR/nvm.sh" ]]; then
  source "$NVM_DIR/nvm.sh"
fi

# NodeJS version via NVM
NODE_VERS=$(node --version)
if [[ $NODE_VERS != v16* ]]; then
  echo "Upgrading Node from ${NODE_VERS}..."
  curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
  source "$NVM_DIR/nvm.sh"

  NV=$(cat .nvmrc)
  nvm install "${NV}"
  nvm use "${NV}"
  nvm alias default "${NV}"
fi

# Yarn
if [ ! $(which yarn) ]; then
  echo "Installing Yarn..."
  npm install -g yarn
fi

yarn config set registry $NPM_LOCAL_REGISTRY

echo "Adding required build tools..."
if [ "$(cd WebApp)" ]; then
  yarn add electron-builder --dev
  yarn install
  cd ..
fi

echo "Electron build for $ELECTRON_TARGET"
dotnet restore

which node
electronize build /target "$ELECTRON_TARGET"
