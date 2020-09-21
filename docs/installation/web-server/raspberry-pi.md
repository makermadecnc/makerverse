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

## Choose Release

There are two download options in the [Latest Release](https://github.com/makermadecnc/makerverse/releases/latest/):

- `makerverse-raspberry-pi-os-lite-x.y.z.img.gz`
- `makerverse-raspberry-pi-os-desktop-x.y.z.img.gz`

These are merely customized versions of [the official Raspberry Pi OS images of the same names](https://www.raspberrypi.org/downloads/raspberry-pi-os/) (Lite vs. Desktop). Once you have downloaded the appropriate release file, unzip it and flash the `.img` to your SD card with your preferred application (e.g., Balena Etcher).

## First Boot

- SSH will already be enabled, and the default username/password (`pi`/`raspbian`) have been left unchanged.
- The hostname defaults to `makerverse`, so if your router supports it you can connect to the pi at `ssh pi@makerverse.local` and `http://makerverse.local:8000`.

As soon as you are ablem to, SSH in to the Raspberry Pi and run `sudo raspi-config` to change the password. The Makerverse application will start automatically on port `8000`. However, especially during the first boot, it will take some time to download (_~600MB_) and unpack the application. On a Raspberry Pi 3 B+ Rev.1.3 (about the  worst device which can handle Makerverse), this has been known to take 20-30 minutes. A RPi4 on a decent internet connection should only take a few minutes.

_**Tip**: read the [useful commands in the Linux Service section](/installation/web-server/linux-service/#useful-commands)!_

## Tablet UI

The Raspberry Pi image comes pre-installed with a mobile/tablet UI. It can be accessed by adding `/tablet` to the URL, such as `http://makerverse.local:8000/tablet`.

However, this UI is not the default UI because it is much less full-featured (it is intended for simple controls, like jogging or pausing program execution, from the shopfloor). You will still need to perform setup and calibration using the normal, desktop UI.

## Desktop (Kiosk Mode)

When running the `makerverse-raspberrypi-os-dekstop.**` (desktop version), you will need to follow on-screen instructions after the first boot to configure your Raspberry Pi. If you don't have an extra keyboard/mouse, just SSH and use `sudo raspi-config` to turn on the VNC in `Interfacing Options`. Then use an app like VNC Viewer to connect from your computer.

The Desktop edition is meant to be used as a kiosk. Once configured, it will automatically launch Chromium in "Kiosk" mode, loading the Makerverse application in a full-screen web browser. Makerverse is still running as a Web Server in the background, so other clients can also simultaneously connect.

_**Note**: if your screen is smaller than 7" or so, you will likely want your Kiosk to use the Tablet UI specified above. To do so, edit the `/home/pi/.config/lxsession/LXDE-pi/autostart` file to become: `@bash /home/pi/makerverse/bin/kiosk /tablet`._

## Shared Directories

- `/home/pi/gcode` should be used for `.nc` (gcode) files.
- `/home/pi/makerverse` contains three subfolders (`commands`, `events`, and `widgets`).

A more complete explanation of this topic may be found in the [Docker section](/installation/web-server/docker/#shared-directories).

## GPIO Pins

The Raspberry Pi image comes with `pigpiod` enabled, which allows you to control the GPIO pins from within Makerverse.

See the [example of creating a command to turn on/off a shopvac](/features/commands/#create-the-command).

## Updating

See: how to [update the linux service installation](/installation/web-server/linux-service/#updating).
