---
layout: default
title: Commands
parent: Features
nav_order: 3
---

# Commands

Commands are _manually triggered_ actions (via the drop-down menu in the top-right).

## Creating

To create a command:

- Go to Settings -> Commands and press "+ Add".
- Give the command a name.
- Type anything in the box that would work in the terminal (command prompt).
- Save & reload the Makerverse page.

Usually, you'll want to trigger some script which performs the action...

## Examples

### Restart Makerverse

If you used the [web-server installation](/installation/web-server/), you already have one command: "Restart Makerverse."

This simple command runs `pkill node`, which terminates the web server. The Docker-based installation will automatically restart itself, and the server should come back up within a minute.

### Raspberry Pi GPIO

The Raspberry Pi GPIO pins can be used to turn on/off switches/relays, lights, etc.

Let's say you have a relay switch connected to GPIO pin #19, which turns your shop-vac on/off.

_**Note**: if you are using the [Raspberry Pi image](/installation/web-server/raspberry-pi/), the first two steps below ("Enable GPIO" and "Create the Script") have already been completed._

#### Enable GPIO

First, you would SSH into the Raspberry Pi and enable remote GPIO access. Type `sudo raspi-config` and choose **Interfacing Options** to enable **Remote GPIO**. Then, turn on the daemon:

```
sudo systemctl enable pigpiod
sudo systemctl start pigpiod
```

#### Create the Script

Next, it's time to create the script. Assuming your makerverse project directory is located at `$HOME/makerverse` (_see: [scripts & widgets](/installation/web-server/docker/#shared-directories)_), you can just use tho following:

```
mkdir -p $HOME/makerverse/commands
nano $HOME/makerverse/commands/gpio.sh
```

Then, paste the following contents:

```
#!/bin/bash

pin="${1}"
flag="${2:-0}"
echo "w ${pin} ${flag}" > /dev/pigpio
```

#### Create the Command

To turn on the shopvac located at GPIO #19, create a new command and give it the contents:

```
bash /home/node/makerverse/commands/gpio.sh 19 1
```

To create a second command to turn it off, replace the `1` with a `0` at the end. To target a different GPIO pin, replace the `19` with the desired pin number.
