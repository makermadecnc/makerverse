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

## Launching Makerverse

Start by downloading the **Source Code** from the [latest release](https://github.com/makermadecnc/makerverse/releases) (or clone the git repository). There is a launch script located at `bin/launch`. For most users, you should simply type `bin/launch` in the terminal to start the application.

If you have `git` installed, you can just copy-and-paste:

```
git clone https://github.com/makermadecnc/makerverse.git
makerverse/bin/launch
```

After a few minutes, you should be able to connect to Makerverse via port `8000` on the IP address of the computer. For example, `http://localhost:8000` (when on the same computer), or `http://192.168.0.100:8000` (if connecting to a computer with the IP address `192.168.0.100`). Once this works, Linux users may optionally move on to the [Linux Service](/installation/web-server/linux-service/) section to run the application automatically.

### Run Manually (Optional)

If you prefer to run the Docker image directly instead of using `bin/launch`, you should do the following:

- Pull the `makerverse/core` image tagged `:latest`, `:prerelease`, or specific version number.
- Use `--privileged` mode and `-v /dev:/dev` for USB access.
- Mount your `.makerverse` config file at `/home/node/.makerverse`.
- Mount your gcode files at `/home/node/gcode`.
- Map the external port to `8000` (`-p 8000:8000`).

For example:
```
docker run --rm --privileged --name makerverse \
  -p "8000:8000" \
  -v /dev:/dev \
  -v "$HOME/gcode:/home/node/gcode" \
  -v "$HOME/.makerverse:/home/node/.makerverse" \
  -v "$HOME/makerverse:/home/node/makerverse" \
  "makerverse/core:latest"
```

## Updating

Each time the `bin/launch` script is run, it will automatically update the application by pulling the latest docker image. If you use the [linux service](/installation/web-server/linux-service/#updating), this happens each time you restart the service.

## Scripts & Widgets

Sometimes, you need to create a file or folder which Makerverse can access.

This is slightly complicated when using Docker:

- The folder where Makerverse is located is called the "project path."
- Anything in this folder is "shared" with the Makerverse application.
- However, while inside the Makerverse application, the path to the shared folder is `/home/node/makerverse`.

### Shared Path

When you run the `bin/launch` script, you should see something like this (example taken from a Raspberry Pi):

```
Makerverse:latest settings: /home/pi/.makerverse (project at: /home/pi/makerverse)
```

On a Mac, the project might be at something like `/Users/zaneclaes/makerverse`.

Inside Makerverse, you always use `/home/node/makerverse` to refer to the project path.

### Example

For example, on your Raspberry Pi or Linux computer running Makerverse, you could run:

```
cd makerverse
mkdir -p commands
```

And then perhaps create a script to turn on your CNC machine (e.g., `nano commands/cnc-power.sh`). You do **not** need to restart Makerverse. You should immediately be able to refer to the files in this "commands" folder (e.g., `/home/node/makerverse/commands/cnc-power.sh`).

For example, you might use the Makerverse settings to create a command which passes the argument "on":

```
bash /home/node/makerverse/actions/cnc-power.sh on
```

And another the argument "off":

```
bash /home/node/makerverse/events/cnc-power.sh off
```
