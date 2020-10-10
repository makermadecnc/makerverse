---
layout: default
title: Maslow
grand_parent: Machines
parent: CNC
nav_order: 1
---

# Maslow

The Maslow is a unique CNC machine due to its hanging "pendant" design.

## Firmware

Coming from GroundControl/WebControl? Read [this forum post](https://forums.maslowcnc.com/t/how-to-upgrade-to-holey-51-28-firmware-using-webcontrol-in-preparation-for-running-makerverse/14549) for help upgrading firmware.

## Calibration

The Maslow requires calibration to correct "chain sag" (catenary effects).

![Calibration Overview](/assets/machines/maslow/calibration_overview.png)

### Before you Start

Do a **pre-flight check**.

Maslow frames are generally built from hand-cut, imprecise materials. Catching errors early will greatly improve the chances of an easy, successful calibration.

Use the Shuttle controls to move your sled to all 4 corners of the stock. Check that it can reach each corner easily and without obstruction. If you have any of these problems, do **not** attempt to calibrate:

- Bowing or warping of the stock.
- Sled lifting or tilting while moving.
- Wires or obstructions preventing movement.
- Anything in the way of the sled, such as protruding wood on the frame.
- Chains not attached to the sled correctly (e.g., rollers came off the disk).

_Note: rather than fixing a frame problem, you can use the Frame Settings (below) to make your machine size smaller than the standard 8 ft. x 4 ft. This will prevent the machine from attempting to access the inaccessible corners. However, after later making changes to the frame to clear the obstruction, the calibration process should be repeated._

### Machine

These options may not need to be changed, as they default to match standard Maslow kits. However, you should take a moment to review them, just in case:

- **Sled Weight**: Measured in Newtons, including the router and all.
- **Rotational Radius**: The radius from the center of the bit to where the chains attach.
- **Chain Direction**: The image above depicts `Off Bottom`. Only choose `Off Top` if the chains come off the sprockets in the opposite direction.
- **Chain Full Length**: The total length of each chain (usually 12 feet, or 3360mm).

### Stock

During calibration, you should make sure that these values match the stock you have loaded. **Measure your stock!** Most plywood is exactly 8x4 feet, but it is important to be certain about these values before calibrating.

- **Width**: the width of the stock.
- **Height**: the height of the stock.

After calibration, you may change the frame settings (machine size) for different sizes of stock, as needed. The machine's origin (at the center of the calibration stock) will remain in exactly the same place. You can therefore load a different size stock on this same origin point without re-calibrating.

### Frame

Frames can vary a lot, as they are usually hand-made.

It's important to get a roughly accurate measurement (+/- 5mm) of these two values:

- **Motor Height**: The distance from the top of the stock to the middle of the motor's sprockets (coplanar with the stock).
- **Motor Width**: The distance between the two motors (measured from the center of each sprocket).

If these two values are not accurate within +/- 5mm, it is likely that the subsequent calibration steps will _fail to ever achieve high precision_.

### Sled

This step measures the distance from the end-mill (tip of the router) to the four edges of the sled.

If you have "standard" Maslow kit (with a circular sled 18" in diameter), it is likely that you do not need to change anything.

The purpose of this step is to allow calibration to infer where the end-mill is located based upon a measurement from an edge of the sled to the edge of the stock. In other words, later in calibration, you will measure from "the top of the sled to the top of the stock." The Calibration process will use the sled values to infer where the center of the sled (and thus the cutter) is located.

### Z-Axis

This step will ensure that the Z-axis travels the correct distance, and invert the Z-axis (if needed).

You will move the Z-axis by some amount (up or down), and then enter the actual distance moved. Calibration will simply scale the Z-axis based upon the actual distance moved.

Alterantively, you can use the "Edit Raw Z-Axis Values" at the bottom of the screen to enter well-known settings values.

### Chains

This step will tell the machine where the end-mill is currently located.

It will also produce a "save point" to return to (_home_) in case the machine ever becomes un-calibrated (such as chains slipping or being removed from the sprockets).

_**Tip**: As you complete the "Set Chains", use a sharpie or paint to mark exactly which link of the chain is at the top of each sprocket. If your machine ever comes out of alignment, such as if chains slip or are removed from the sprockets, you will need to return it to this position. It is important that the chains are exactly in the same position (within 1mm). **Do not try to visually move the sled back to the same position**. Most users simply mark the chain link which is at the 12 o'clock (noon) position on the sprocket. Once you are certain the chain is in the exact same position, press the "Reset Chains" button on the main screen and Makerverse will tell the Maslow it is back at this saved location._

### Edge Calibration

Edge calibration is a way to refine X/Y positioning without actually cutting (destroying) stock.

Both Edge and Precision calibration will use measurements to correct for chain sag and ensure that your sled is in the correct X/Y position. However, these steps may also modify your motor width and motor height to account for slight measurement errors. For the best results, use a millimeter tape measure to take measurements in these steps.

- First ensure that you have selected the correct sled type from the bottom of the screen. The default is a circular sled with a 9" radius.
- Press each of the six **move** buttons to move the sled into that location.
- Measure the distance from the edge of the sled to the edge of the stock and enter it into the appropriate field. If the edge of the sled is outside the stock, use a negative value.
- When you are done, press the _Calibrate_ button.

_**Tip**: if any measurement is more than 1" (25mm) or so, something is wrong with your build. One of the previous settings or measurements is almost certainly wrong, or something is preventing your sled from moving freely._

If the calibration results look good, press **Apply Calibration Results**.

You can repeat the Edge Calibration (or move on to Precision Calibration) until you are satisfied with the results. In general, anything more than 6mm (1/4") of average/total error will likely hurt your ability to cut straight lines/corners... especially in the edges of the stock.

### Precision Calibration

This is very similar to Edge Calibration, except that this time the Maslow will cut holes in the stock. You can choose the distance from the edge at which the holes are cut, and the depth to which they are cut. With each hole, measure the distance from the center of the hole to the edge of the stock.

Using a 1/8" end-mill, it should be possible to easily achieve an **average error distance** of less that `2mm` and a **max error distance** of less than `4mm`. With several rounds of calibration, values of less than `1mm` and `2mm` should be entirely attainable.

### Z-Axis Calibration

**Important**: different shields require different hardware settings.

You should not need to change anything with the Mega, but there are some extra steps for the Arduino Due. You may need to change the following:

- **MakerMade M2** (V2 shield): Make sure **Step pulse invert** (`$3`) is set to `4` (inverts the Z-axis). Also make sure **Z-axis travel resolution** (`$102`) is set to `472.5` (scales the Z-axis).
- **V1 Shield**: You may need to change **Z-axis travel resolution** (`$102`) based upon your gear tooth ratio.

## Further Reading

- [Getting Starting with the Maslow CNC Router](https://www.technicallywizardry.com/maslow-cnc-router-simplified-guide/)
- [Upgrading the Frame for Better Accuracy](https://www.technicallywizardry.com/upgrade-maslow-cnc-frame-plans/)

