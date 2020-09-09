---
layout: default
nav_order: 2
title: Machines
permalink: /machines/
has_children: true
---

# Machines

Makerverse uses various **controllers** to speak to different machines.

## Controllers

Many machines use a standard protocol, like Grbl (CNC) or Marlin (3DP).

In Makerverse, when creating a New Workspace, you will need to select the controller appropriate to how your machine communicates (as well as the Baud Rate used by your firmware).

In order to make this process easier, we are working on compiling a list of well-tested machines in Makerverse (_see: Table of Contents, below_).

If you _cannot find your machine_ (in the app or in this documentation), it is nevertheless _likely to still be supported_ (as long as it uses a standard protocol). You will need to identify the correct **controller** for the protocol, as well as the baud rate (which is probably buried somewhere in your machine's documentation).

## Firmware

Generally, you should be certain you are using the latest firmware for your machine. In the list of well-tested machines, you might find a link to the specific well-tested version of the firmware. When in doubt, it's best to use this specific version.

## Machine-Specific Instructions

In some cases, like with the Maslow CNC, there are also important machine-specific instructions to follow. Please be sure to read any instructions related to your machine in this documentation or in the app.
