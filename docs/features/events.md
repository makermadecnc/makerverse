---
layout: default
title: Events
parent: Features
nav_order: 4
---

# Events

- Are triggered automatically, such as when a machine connects.
- Can run a script (command) or GCode

## List Of Events

- Startup
- Open a Serial Port
- Close a Serial Port
- Ready
- Program: Start
- Program: Stop
- Program: Pause
- Program: Resume
- Feed Hold
- Cycle Start
- Set Home
- Sleep
- Run Macro
- Load Macro

## Creating an Event

- Go to Settings -> Events and press "+ Add"
- To run scripts, use a "system" trigger and follow the [commands](/features/commands/) instructions. The event scripts reside in the events folder under the base makerverse folder and regardless of the makerverse folder name, the path to get to the event is ~/makerverse/events/scriptname.
- To run Gcode, use a "G-code" trigger and enter any gcode you wish.
