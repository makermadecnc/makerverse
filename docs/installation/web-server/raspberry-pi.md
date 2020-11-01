---
layout: default
title: Raspberry Pi Image
grand_parent: Installation
parent: Web Server
nav_order: 1
---

# Raspberry Pi Image

This is the easiest approach.

It does all the work of setting up the Docker environment (and Linux service) for you. If you prefer to set up your Raspberry Pi manually (instead of using a pre-built SD card), see the [Linux Service](/installation/web-server/linux-service/) instructions.

## Requirements

- Raspberry Pi 3B+ (or better).
- 16 GB micro SD card (or bigger).
- Power supply for the RPi.

At least **one of** the following:

- An ethernet connection (plugged in to the RPi).
- A keyboard, monitor, and mouse.

_**Note**: you will be able to configure WiFi later in the setup. If neither of the above two options are available to you, you will need to [use a wpa_supplicant.conf](https://www.raspberrypi.org/documentation/configuration/wireless/headless.md) to pre-configure WiFi._

Additionally, the first time Makerverse starts, you will need an active internet connection.

## Choose Release

There are two download options in the [Latest Release](https://github.com/makermadecnc/makerverse/releases/latest/):

- `makerverse-raspberry-pi-os-lite-x.y.z.img.gz`
- `makerverse-raspberry-pi-os-desktop-x.y.z.img.gz`

These are merely customized versions of [the official Raspberry Pi OS images of the same names](https://www.raspberrypi.org/downloads/raspberry-pi-os/) (Lite vs. Desktop). Once you have downloaded the appropriate release file, unzip it and flash the `.img` to your SD card with your preferred application (e.g., Balena Etcher).

_**Note**: the `lite` image means that there is no GUI! It is "command-line only" (headless), so everything will be text based (no desktop)._

Then, just plug the RPi in and power it up!

## Connecting to the RPi

You'll need to get to a terminal in order to setup the Pi. You can either:

- Attach a mouse and keyboard.
- Use SSH to connect from your computer: `ssh pi@makerverse.local`.

_**Note**: SSH is enabled by default in the Pi image. If the SSH command cannot connect (does not show a login prompt), either the Pi is not connected to the same network as the computer from which you are attempting to access it, or your router does not support looking up the Pi by its name. In either case, you should open your router's admin interface and try to find the Pi's IP address on the network. If you can find the IP address, you can use it instead of `makerverse.local`._

The username/password (`pi`/`raspberry`) have been left unchanged from a "normal" Raspberry Pi OS. Use this whenever prompted for a username and password.

## First Boot

Once you've got a terminal open, type `sudo raspi-config` to run the official Raspberry Pi configuration tool.

- You should **definitely** change the password, to keep the device secure!
- You might also change the hostname from `makerverse` to something more memorable, like `maslow`, so you can use `maslow.local` instead of `makerverse.local`.
- You might also want to turn on WiFi, so you do not need to use an ethernet connection on the Raspberry Pi to have access to Makerverse.

_**Tip**: read the [useful commands in the Linux Service section](/installation/web-server/linux-service/#useful-commands)!_

_**Note**: GPIO pin communication is enabled by default in Makerverse (meaning that `pigpiod` is enabled). This allows you to [create commands](/features/commands/) that turn on and off the machine, for example._

## Opening Makerverse

You can connect to Makerverse from any web browser on the same network.

_**Note**: the Raspberry Pi image, unlike other web server instals, will run the Makerverse server on port `80` instead of port `8000`. This means that you can connect without specifying a port in your browser (e.g., `http://makerverse.local` instead of `http://makerverse.local:8000`)._

The Makerverse application will start automatically on port `80`. However, especially during the first boot, it will take some time to download (_~600MB_) and unpack the application. On a Raspberry Pi 3 B+ Rev.1.3 (about the  worst device which can handle Makerverse), this has been known to take 20-30 minutes. A RPi4 on a decent internet connection should only take a few minutes. To check on the status of the startup or update, see the [useful commands in the Linux Service section](/installation/web-server/linux-service/#useful-commands).

## Tablet UI

The Raspberry Pi image comes pre-installed with a mobile/tablet UI. It can be accessed by adding `/tablet` to the URL, such as `http://makerverse.local/tablet`.

However, this UI is not the default UI because it is much less full-featured (it is intended for simple controls, like jogging or pausing program execution, from the shopfloor). You will still need to perform setup and calibration using the normal, desktop UI.

## Desktop

When running the `makerverse-raspberrypi-os-dekstop.**` (desktop version), you will need to follow on-screen instructions after the first boot to configure your Raspberry Pi. This image is based upon a standard Raspberry Pi OS Desktop installation, so please refer to the official documentation for any help.

You can find the Makerverse "application" in the "Other" section of the start menu. In fact, the "application" really just opens a web browser to `http://localhost`.

### Kiosk Mode

When running the Desktop variation, you can enable "Kiosk" mode. This turn your Raspberry Pi into a dedicated Makerverse device.

_**Note**: kiosk mode causes Makerverse to run full-screen and effectively disable the Raspberry Pi desktop. It is best suited for scenarios where you only want to use Makerverse on the Raspberry Pi (single-purpose device). It also can fit more on the screen, and doesn't require a keyboard/mouse to use (e.g., touchscreen)._

To enable Kiosk mode, run the following command:

```
echo "@bash /home/pi/makerverse/bin/kiosk" > /home/pi/.config/lxsession/LXDE-pi/autostart
```

... and then reboot the Raspberry Pi. Once it has rebooted, you should notice that the normal desktop does not open. Instead, the screen stays black while Makerverse starts. Makerverse is still running as a Web Server in the background, so other clients can also simultaneously connect. In this mode, Chromium takes over the desktop, hiding all menus in order to maximize screen-space.

- If your keyboard/mouse are attached directly to the Pi, use the `Alt + F4` hotkey to close the full-screen web browser, and/or `Ctrl + Alt + T` to open a terminal.
- If you don't have an extra keyboard/mouse, just SSH and use `sudo raspi-config` to turn on the VNC in `Interfacing Options`. Then use an app like VNC Viewer to connect from your computer.

_**Note**: if your screen is smaller than 7" or so, you will likely want your Kiosk to use the Tablet UI specified above. To do so, use `sudo nano /etc/environment` to add the new line: `MAKERVERSE_PATH=/tablet`._

## Shared Directories

- `/home/pi/gcode` should be used for `.nc` (gcode) files.
- `/home/pi/makerverse` contains three subfolders (`commands`, `events`, and `widgets`).

A more complete explanation of this topic may be found in the [Docker section](/installation/web-server/docker/#shared-directories).

## GPIO Pins

The Raspberry Pi image comes with `pigpiod` enabled, which allows you to control the GPIO pins from within Makerverse.

See the [example of creating a command to turn on/off a shopvac](/features/commands/#create-the-command).

## Updating

See: how to [update the linux service installation](/installation/web-server/linux-service/#updating).
