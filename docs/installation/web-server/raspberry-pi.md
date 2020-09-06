---
layout: default
title: Raspberry Pi Image
grand_parent: Installation
parent: Web Server
nav_order: 1
---

# Raspberry Pi Image

This is the easiest approach.

It does all the work of setting up the Linux Service and Docker Image (below) for you.

## Choose Release

There are two download options in the [Latest Release](github.com/makermadecnc/makerverse/releases/latest/):

- `makerverse-raspberry-pi-os-lite-x.y.z.img.gz`
- `makerverse-raspberry-pi-os-desktop-x.y.z.img.gz`

These are merely customized versions of [the official Raspberry Pi OS images of the same names](https://www.raspberrypi.org/downloads/raspberry-pi-os/) (Lite vs. Desktop). Once you have downloaded the appropriate release file, unzip it and flash the `.img` to your SD card with your preferred application (e.g., Balena Etcher).

## First Boot

- SSH will already be enabled, and the default username/password (`pi`/`raspbian`) have been left unchanged.
- The hostname defaults to `makerverse`, so if your router supports it you can connect to the pi at `ssh pi@makerverse.local` and `http://makerverse.local:8000`.

As soon as you are ablem to, SSH in to the Raspberry Pi and run `sudo raspi-config` to change the password. The Makerverse application will start automatically on port `8000`. However, especially during the first boot, it will take some time to download (_~600MB_) and unpack the application. On a Raspberry Pi 3 B+ Rev.1.3 (about the  worst device which can handle Makerverse), this has been known to take 20-30 minutes. A RPi4 on a decent internet connection should only take a few minutes.

Tip: read the "Handy commands" in the "Linux Service" section!

## Tablet (Kiosk Mode)

The Desktop edition is meant to be used as a shopfloor tablet. It will automatically launch Chromium in "Kiosk" mode, loading the Makerverse application in a full-screen web browser. Makerverse is still running as a Web Server in the background, so other clients can also simultaneously connect.
