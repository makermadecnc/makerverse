---
layout: default
title: CNC
parent: Machines
nav_order: 1
has_children: true
---

# CNC

Find your machine, below, and click on the appropriate link for the latest firmware and instructions.

_If you click on one of the links and are taken to a Github page, use the green **Code** button at the top to download the latest version, (unless specified otherwise in the instructions)._

## Maslow

_Please read the [Maslow-specific instructions](/machines/cnc/maslow)._

There are two common types of Maslow, built with two different Arduino boards:

- [Arduino Mega](https://github.com/WebControlCNC/Firmware/tree/release/holey): Maslow "Classic" (JumpStart Kit)
- [Arduino Due](https://github.com/makermadecnc/MaslowDue): M2, or similar

_**Tip**: Coming from GroundControl/WebControl with an original Maslow Mega? Read [this forum post](https://forums.maslowcnc.com/t/how-to-upgrade-to-holey-51-28-firmware-using-webcontrol-in-preparation-for-running-makerverse/14549) for help upgrading firmware._

_**Note**: the firmware for the Arduino Due underwent significant changes in September, 2020. If your firmware was installed before this point, it is actually a Grbl machine (below) and does not have support for the [Maslow-specific features](/machines/cnc/maslow), like correcting for chain-sag effects (rounding) that happen in the corners of the stock._

## Grbl

- [Grbl](https://github.com/gnea/grbl) ([Download](https://github.com/gnea/grbl/releases))
- [Grbl-Mega](https://github.com/gnea/grbl-Mega) ([Download](https://github.com/gnea/grbl-Mega/releases))

#### Tested On

- SainSmart Genmitsu 3180 Pro (Baud Rate: 115200)
