---
layout: default
title: Programs
parent: Features
nav_order: 1
---

# Programs

Makerverse runs gcode (`.nc`) programs.

## Load

### Upload Program

From your workspace, press the "Upload Program" button. You will be able to select a file from your current device.

### Watch Directory

On the right side of the "Upload Program" button is an arrow. Clicking it lets you explore the "Watch Directory." For example, with a Web Server installation, you can instead place the `.nc` file into the folder at `$HOME/gcode` on the computer where Makerverse is installed.

_On the Raspberry Pi image, the watch directory is `/home/pi/gcode`._

_*Note*: Makerverse does not (yet) support folders within the watch directory._

## Run

To run the program, just press the play button (next to "Upload Program").

You can monitor the execution with the `G-code` widget.

### Multiple Devices

With a Web Server installation, you can upload a program from one computer (e.g., desktop) and then run/monitor Makerverse from another (e.g., shopfloor tablet or smartphone).
