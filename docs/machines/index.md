---
layout: default
nav_order: 2
title: Machines
permalink: /machines/
has_children: true
---

# Machines

Makerverse uses various [controllers](/features/#controllers) to speak to different machines.

## Supported Machines

_**Note**: in order to make the controller setup process easier, we are working on compiling a list of well-tested machines in Makerverse (see: Table of Contents, below)._

From the homescreen, to create a new workspace for your machine, you need to select:

- The correct USB port.
- The correct [controller](/features/#controllers).
- The correct **baud rate** for your firmware (_see Firmware, below_).

If you _cannot find your machine_ (in the app or in this documentation), it is nevertheless _likely to still be supported_ (as long as it uses a standard protocol). You will need to identify the correct **controller** for the protocol, as well as the baud rate (which is probably buried somewhere in your machine's documentation).

## Firmware

Firmware is the code which runs on the machine itself (usually, an Arduino board connected via USB).

Your machine likely came pre-installed with some firmware. Generally, you should be certain you are using the latest firmware for your machine. In the list of well-tested machines, you might find a link to the specific well-tested version of the firmware. When in doubt, it's best to use this specific version.

The firmware also determines which **baud rate** to use. In the list below, the correct baud rates are noted. If your machine is not listed, please refer to the manufacturer documentation to determine the correct baud rate.

## Machine-Specific Instructions

In some cases, like with the Maslow CNC, there are also important machine-specific instructions to follow. Please be sure to read any instructions related to your machine in this documentation or in the app.
