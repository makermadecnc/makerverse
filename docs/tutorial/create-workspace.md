---
layout: default
title: Create Workspace
parent: Tutorial
nav_order: 2
---

# Creating a Workspace

With [Makerverse open](/tutorial/connect), you can now create a Workspace.

## What's in a Workspace?

A **workspace** holds a connection to a single machine (CNC, 3D printer, etc.)

It knows how to "talk to" the machine (what port the machine uses, for example). It will run your prints/cuts and generally be the home of your machine.

A workspace **does not** store machine settings. In almost every case, your machine itself stores things like the calibration settings. This means that you can detach the machine from the USB port and safely connect it to a different computer (running Makerverse, or any other program compatible with your machine) and the machine will continue to function.

## New Workspace

Find the **New Workspace** window on the **Home** (first tab) of makerverse.

### Pre-Configured Machines

OpenWorkShop maintains a "community catalog" of pre-configured machines.

When you choose from the catalog, Makerverse will automatically choose the correct options for you. Pre-configured machines will also check that you are running the correct firmware version.

Just choose the name of your machine from the "New Workspace" screen.

### Create New Machine

If you **cannot find** your machine in the community catalog, you will need to use the "Create New Machine" button. On this screen, you will need to enter the controller type (e.g., Grbl, Marlin), baud rate, and eventually the size of each axis.

### Connect

Once you've configured the machine, the **Connect** button will appear.

You will need to choose the correct port to which the machine is connected. If you see a simple **error opening serial port** when you try to connect, either you do not have permission to open the port, or it is otherwise busy.

## Customize Workspace

You can choose the name, background color, icon, and other traits of your workspace.

### Axes

If you used a pre-configured machine, your axes are already set.

In other cases, you should take the time to make sure your axes are correctly set.

_**Note**: axes settings have no impact upon the actual functioning of the machine. They merely change the UI to be more conveniently sized._

The `accuracy` value specifies the minimum distance the machine can move along that axis. For example, `0.1`mm might be appropriate to a CNC machine, but not to a 3D printer.

The `precision` value indicates the number of digits used for rounding the (displayed) value of the axis. For example, `0` would round the value to the whole `mm`.

## New Machine?

Some machines, like the [Maslow](/machines/cnc/maslow), may ask if this is a new machine (or the firmware has been recently re-installed). If you select "Yes," the machine settings will be reset and the recommended settings will be applied. You may then be asked to calibrate the machine before moving on...

## Next Steps

Learn how to control your machine manually in the [workspace basics](/tutorial/workspace-basics).
