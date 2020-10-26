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

## Updating

The web server installation automatically updates when it restarts.

To manually update a **Linux Service** install, use `sudo systemctl restart makerverse`.

_**Note**: while the update is downloaded, Makerverse will continue to run the old installation. You can check on the update progress with `journalctl -xe`. Once the update is complete, refresh your internet browser and look at the "About" screen to confirm the new version._

To manually update a Docker install (without a Linux service), run `bin/launch` from within the Makerverse directory. This can also be useful if you would like more feedback on the update progress (this approach happens in the foreground, instead of requiring that you use the `journalctl` command to view logs).
