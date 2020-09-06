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

- First ensure that you are able to start the application correctly via `bin/launch`. See the Docker section if you have trouble.
- Once you're sure the server is running the way you want it, terminate the server.
- Now run `bin/server install` to create the service.

## Handy Commands

Since Makerverse runs as a service, you can use all the standard systemd commands. Type `sudo systemctl [command] makerverse`, replacing **[command]** with one of the following:

- `start`: Run the application
- `enable`: Start the application automatically
- `status`: See application health
- `restart`: Restart the application
- `stop`: Stop the application
- `disable`: Do not start the application automatically

## Debugging

The following commands are helpful if something is not working:

- Check if Makerverse is running: `sudo systemctl status makerverse`
- Restart (and update!) Makerverse: `sudo systemctl restart makerverse`
- See Makerverse server logs: `docker logs makerverse`
- See all system logs (find problems with boot): `journalctl -xe`