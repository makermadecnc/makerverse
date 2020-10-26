---
layout: default
title: Run Programs
parent: Tutorial
nav_order: 4
---

# Run Programs

A "program" is a set of instructions which tells your machine what to print, cut, etc.

## Supported Programs

Makerverse supports `gcode` (`.nc` files).

_**Note**: this page assumes you already know how to create a program for your machine. [Easel](https://easel.inventables.com/) is popular for creating simple programs, while Fusion360 and other CAD programs are more feature-rich. Please refer to your machine's documentation, owner's group, or forums for more help._

## Upload Programs

From your workspace, press the "Upload Program" button to select a file on the current computer.

When using a web-server installation, you can also use the arrow on the right side of the button to browse the "Watch Directory." This directory is located at `$HOME/gcode` on the computer running Makerverse. Any files placed directly in the folder (not in sub-folders) will be visible to Makerverse.

Once the program has been selected, it will appear in the **visualizer** at the center of the screen.

## Align Work Position

The **Work Position** defines where the program begins.

Therefore, you may wish to change the work position to align the program in the visualizer with your desired location. However, note that each program also has an origin. For example, in Easel, the origin is the bottom-left of your design. In Fusion 360, the origin might be set to the center of the design. When you change the work position, you are setting the location for the origin of the program.

## Start the Program

The "play" button to the right of the Upload button will start the program.

Some programs may indicate feedback, or require user input via banners at the bottom of the screen. For example, a `M6 (Tool Change)` will pause the program and wait for you to press the Play button in order to resume.

Once the program begins, you can use the pause button to stop execution.

_**Tip**: pausing execution stops sending commands. The current command will still finish. In case of emergency, use the red Reset/Halt button._

### Paused Programs

While paused, movement controls will remain deactivated. This prevents losing your position during the job. To regain control, you will need to use the **stop** button, to the right of the pause button.

### Stopped Programs

Once stopped, a program must be restarted from the beginning with the **play** button.

You can also unload the program by using the red trash icon (which replaces the stop button).

## Completion

You can use the **G-code widget** on the right side to watch the progress of the program, including an (estimated) remaining time.

When the program completes, execution will simply stop.
