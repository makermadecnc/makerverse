---
layout: default
nav_order: 3
title: Machines
permalink: /machines/
has_children: true
---

# Machines

Makerverse uses various [controllers](/features/#controllers) to speak to different machines.

## Supported Machines

_**Note**: when [creating a workspace](/tutorial/create-workspace/), some machines come pre-configured via _the community catalog._

If you _cannot find your machine_ (in the app or in this documentation), it is nevertheless _likely to still be supported_ (as long as it uses a standard protocol). You will need to identify the correct **controller** for the protocol, as well as the baud rate (which is probably buried somewhere in your machine's documentation).

## Firmware

Firmware is the code which runs on the machine itself (usually, an Arduino board connected via USB). Your machine likely came pre-installed with some firmware.

Generally, you should be certain you are using the latest firmware for your machine. If you have selected a machine from the community catalog, you will receive recommendations and support links for your firmware.

## Troubleshooting Connections

When you set up a new workspace, Makerverse attempts to communicate with the machine:

### Protocol Validation

Makerverse will either say **Confimed Protocol:** or **Unable to Validate Protocol**.

If Makerverse says "_board not speaking at baud rate, or port is busy_", then it is entirely unable to communicate with the machine. There are many possible causes: the port or baud rate may be wrong, the hardware (e.g., USB cable) may be damaged, or it may even just be powered off.

On the other hand, if Makerverse says "_invalid response from board_", it means it has received some response from the board, but not what it was expecting. Makerverse will then print out exactly what the machine said so that you can inspect the text for any hints. A common cause of this problem is choosing the wrong controller (e.g., trying to control a 3D printer by choosing Grbl).

### Further Debugging

If you're stuck, try connecting the board to the Arduino IDE. Open up a serial port at the correct baud rate and see what the machine says. Most machines have informational commands, such as `$I` to print the current firmware version with Grbl.

## Machine-Specific Instructions

In some cases, like with the Maslow CNC, there are also important machine-specific instructions to follow. Please be sure to read any instructions related to your machine in this documentation or in the app.
