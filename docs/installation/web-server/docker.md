---
layout: default
title: Docker Quickstart
grand_parent: Installation
parent: Web Server
nav_order: 2
---

# Docker

Makerverse is distributed as a multi-architecture Docker image, so it can run on nearly any computer.

## Installing Docker

It is recommended to use the Windows / MacOS [installers](https://www.docker.com/products/docker-desktop), when applicable. For Linux users, a few extra steps must be taken to grant the necessary permissions.

_Note: these steps are already performed on the Raspberry Pi image._

Install docker:
```
curl -sSL https://get.docker.com | sh
```

And then grant your current user access to Docker, and start it:
```
sudo usermod -aG docker "$(whoami)"
sudo systemctl enable docker
sudo systemctl start docker
````

At this point, you probably need to logout (or quit the SSH session) and log back in again. You should have just given your current user (e.g., `pi`) access to Docker. To check that this is true, you can do `docker container ls`. Notice this time we did **not** use `sudo`. As long as it doesn't give an error about permissions, your current user now has access to Docker.

## Granting USB Access

On Linux (including Raspbian), you will also probably need to grant Docker access to your USB devices. Do a `sudo nano /etc/udev/rules.d/49-makerverse.rules` to create a file with the following contents:

```
KERNEL=="ttyUSB[0-9]*",MODE="0666"
KERNEL=="ttyACM[0-9]*",MODE="0666"
```

Unplug any USB ports connected to a machine, and then re-connect them. The rule we just added will now take effect forevermore, giving Makerverse access to the USB ports.

## Running Makerverse

The `bin/launch` script is the easiest way to run Makerverse. For most users, you should simply type `bin/launch` in the terminal to start the application. You should be able to connect to Makerverse via port `8000` on the IP address of the computer. For example, `http://localhost:8000` (when on the same computer), or `http://192.168.0.100:8000` (if connecting to a computer with the IP address `192.168.0.100`). Once this works, Linux users may optionally move on to the "Linux Service" section to run the application automatically.

If you prefer to run the Docker image directly instead of using `bin/launch`, you should do the following:

- Pull  the `makerverse/core` image, the `:latest`, `:prerelease`, or specific version number (e.g., `v1.1.0`) tag.
- Use `--privileged` mode and `-v /dev:/dev` for USB access.
- Mount your `.makerverse` config file at `/home/node/.makerverse`.
- Mount your gcode files at `/home/node/gcode`.
- Map the external port to `8000` (`-p 8000:8000`).
