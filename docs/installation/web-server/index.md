---
layout: default
title: Web Server
parent: Installation
has_children: true
nav_order: 2
---

# Web Server

With this approach, you can connect to the Makerverse app from any web browser on the same network. This should work on any computer, but it is best suited for a Linux computer which can act as a dedicated web server.

_**Tip**: the easiest setup is the [Raspberry Pi Image](/installation/web-server/raspberry-pi/), which configures the web server for you._

## Launch Script

Start by downloading the **Source Code** from the [latest release](https://github.com/makermadecnc/makerverse/releases) (or clone the git repository).

There is a launch script located at `bin/launch`. Run it from a command prompt on almost any machine. It will try to run Makerverse via Docker (by default). See the [Docker](/installation/web-server/docker/) section for help.

## Configuration

You can set the following environment variables to configure Makerverse on any Web Server:

- `MAKERVERSE_PORT`: Which port to listen on (default: `8000`).
- `MAKERVERSE_HOME`: Where the settings files should be stored (default: `$HOME`).
- `MAKERVERSE_SRC_DIR`: Where the Makerverse code is located (default: `$HOME/makerverse`).
- `MAKERVERSE_LAUNCH_METHOD`: Use Docker or Node? (default: `docker`).

## Updating

The web server installation automatically updates when it restarts.

To update a web-server install:

- On a [Raspberry Pi or Linux service installation](/installation/web-server/linux-service/#updating).
- When [using Docker (`bin/launch`) directly](/installation/web-server/docker/#updating).
