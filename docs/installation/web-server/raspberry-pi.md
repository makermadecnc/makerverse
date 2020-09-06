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

Download the `makerverse-raspbian-lite-x.y.z.img.gz` file from the [Latest Release](github.com/makermadecnc/makerverse/releases/latest/). Unzip the file and flash the `.img` to your SD card with your preferred application (e.g., Balena Etcher). SSH will already be enabled, and the default username/password (`pi`/`raspbian`) have been left unchanged. The hostname defaults to `makerverse`, so if your router supports it you can connect to the pi at `ssh pi@makerverse.local` and `http://makerverse.local:8000`. As soon as you are ablem to, SSH in to the Raspberry Pi and run `sudo raspi-config` to change the password.

The Makerverse application will start automatically on port `8000`. However, especially during the first boot, it will take some time to download (_~600MB_) and unpack the application. On a Raspberry Pi 3 B+ Rev.1.3 (about the  worst device which can handle Makerverse), this has been known to take 20-30 minutes. A RPi4 on a decent internet connection should only take a few minutes.

Tip: read the "Handy commands" in the "Linux Service" section!
