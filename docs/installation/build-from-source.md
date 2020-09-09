---
layout: default
title: Build from Source
parent: Installation
nav_order: 3
---

# Build from Source

This should only be used by developers or those who cannot use Docker.

## Git

Start by cloning the git repository:

```
git clone https://github.com/makermadecnc/makerverse.git
```

## Node.js

You will need `node` (**Node.js**) version `12.xx.y`. Downloads for Windows, Mac, and Linux can be [found here](https://nodejs.org/en/download/) (including [via package managers](https://nodejs.org/en/download/package-manager/)). On a Raspberry Pi or Debian Linux system, use the following:

```
curl -sL https://deb.nodesource.com/setup_12.x | sudo bash -
sudo apt-get install -y nodejs
```

## Build and Run

### Dependencies

Enter the source code directory from the command line and run:

```
npm install
```

This will download and install all required software. It generally only needs to be done once (unless a major update happens).

### Production Build

To build and run the production application:

```
npm run build-latest
bin/makerverse
```

### Development Mode

Instead of the Production Build, you can start the webserver in development mode with hot-reloading for the frontend (UI):

```
npm run dev
```

## Troubleshooting Node.js

Node.js 12 is recommended. You can install [Node Version Manager](https://github.com/creationix/nvm) to manage multiple Node.js versions. If you have `git` installed, just clone the `nvm` repo, and check out the latest version:
```
git clone https://github.com/creationix/nvm.git ~/.nvm
cd ~/.nvm
git checkout `git describe --abbrev=0 --tags`
cd ..
. ~/.nvm/nvm.sh
```

Add these lines to your `~/.bash_profile`, `~/.bashrc`, or `~/.profile` file to have it automatically sourced upon login:
```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm
```

Once installed, you can select Node.js versions with:
```
nvm install 10
nvm use 10
```

It's also recommended that you upgrade npm to the latest version. To upgrade, run:
```
npm install npm@latest -g
```

## Command-Line Usage

For help, type `./bin/makerverse --help`:
```
Usage: app [options]

Options:
  -V, --version                       output the version number
  -p, --port <port>                   Set listen port (default: 8000) (default: 8000)
  -H, --host <host>                   Set listen address or hostname (default: 0.0.0.0) (default: "0.0.0.0")
  -b, --backlog <backlog>             Set listen backlog (default: 511) (default: 511)
  -c, --config <filename>             Set config file (default: ~/.makerverse)
  -v, --verbose                       Increase the verbosity level (-v, -vv, -vvv)
  -m, --mount <route-path>:<target>   Add a mount point for serving static files (default: [])
  -w, --watch-directory <path>        Watch a directory for changes
  --access-token-lifetime <lifetime>  Access token lifetime in seconds or a time span string (default: 30d)
  --allow-remote-access               Allow remote access to the server (default: false)
  -h, --help                          output usage information
```

## Updating

- Use `git pull` to update the source code.
- You probably don't need to update dependencies, but it doesn't hurt to run the **Dependencies** step again.
- Follow either the **Production Build** or **Development Mode** step.
