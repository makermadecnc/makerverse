---
layout: default
title: Linux Service
grand_parent: Installation
parent: Web Server
nav_order: 3
---

# Linux Service

On a Raspberry Pi, Ubuntu, and other Linux machines you can use systemd to run Makerverse as a service. This means it will start automatically on boot, and run in the background.

_Note: these steps are already performed on the Raspberry Pi image._

- Read the [Docker launch instructions](/installation/web-server/docker/) and make sure `bin/launch` works.
- Once you're sure the server is running the way you want it, terminate the server.
- Now run `bin/server install` to create the service.

## Useful Commands

Since Makerverse runs as a service, you can use all the standard **systemd** commands.

Type `sudo systemctl [command] makerverse`, replacing **[command]** with one of the following:

- `start`: Run the application.
- `enable`: Start the application automatically.
- `status`: See application health.
- `restart`: Restart the application.
- `stop`: Stop the application.
- `disable`: Do not start the application automatically.

## Configuration

If you would like to set one or more [configuration (environment) variables](/installation/web-server/docker/#configuration), you will need to pass them to the service. For example, to set the port to 80 (_which is done by default on the Raspberry Pi image_), **reinstall the service** as follows (from the Makerverse directory):

```
sudo bin/build-service.sh install $(whoami) "export MAKERVERSE_PORT=80"
```

- The second parameter is the username (e.g., `pi`) which will run the service.
- The third parameter will be prepended to the start command, in this case exporting the environment variable.

## Troubleshooting

The following commands are helpful if something is not working:

- Check if Makerverse is running: `sudo systemctl status makerverse`
- Restart (and update!) Makerverse: `sudo systemctl restart makerverse`
- See Makerverse server logs: `docker logs makerverse`
- See all system logs (find problems with boot): `journalctl -xe`

## Updating

Just run the launch script, i.e., `makerverse/bin/launch`. Details about the updating progress (if any) will be displayed on the screen before the server is restarted. Note that any clients will be disconnected, and any cuts/prints halted.
