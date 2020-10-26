---
layout: default
title: Features
permalink: /features/
nav_order: 4
has_children: true
---

# Features

## Controllers

Many machines use a standard protocol, like Grbl (CNC) or Marlin (3DP).

Makerverse interfaces with various [machines](/machines/) through its supported controllers:

* **Grbl**
* **Maslow**
* **Marlin**
* _TinyG (experimental)_
* _Smoothie (experimental)_

In Makerverse, when creating a New Workspace, you will need to select the controller appropriate to how your machine communicates.

## The Settings File

Settings are loaded from the `$HOME/.makerverse` file (e.g., `/home/pi/.makerverse`); a [sample file is located here](https://github.com/makermadecnc/makerverse/blob/master/examples/.makerverse).

## Core Features

* 6-axis digital readout (DRO)
* Tool path 3D visualization
* Simultaneously communicate with multiple clients
* Customizable workspace
* Custom MDI (Multiple Document Interface) command buttons (since 1.9.13)
* My Account
* Commands
* Events
* [Keyboard Shortcuts](https://cnc.js.org/docs/user-guide/#keyboard-shortcuts)
* [Contour ShuttleXpress](https://cnc.js.org/docs/user-guide/#contour-shuttlexpress)
* Multi-Language Support
* Watch Directory
* Laser
* [Tool Change](https://github.com/cncjs/cncjs/wiki/Tool-Change) (since 1.9.11)
* Z-Probe
