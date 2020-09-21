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

If you don't wish to use the pre-built image, you can achieve the same thing on a Raspberry Pi (or any Debian computer) using the [Linux Service](/installation/web-server/linux-service/) installation. For all other cases, refer directly to the [Docker](/installation/web-server/docker/) instructions.

## Configuration

You can set the following environment variables to configure Makerverse on any Web Server:

- `MAKERVERSE_PORT`: Which port to listen on (default: `8000`).
- `MAKERVERSE_HOME`: Where the settings files should be stored (default: `$HOME`).
- `MAKERVERSE_SRC_DIR`: Where the Makerverse code is located (default: `$HOME/makerverse`).
- `MAKERVERSE_LAUNCH_METHOD`: Use Docker or Node? (default: `docker`).

## Updating

The web server installation automatically updates when it restarts.

To update a web-server install, just run the `bin/launch` script:

```
$HOME/makerverse/bin/launch
```
