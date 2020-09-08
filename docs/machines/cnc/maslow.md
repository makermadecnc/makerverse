---
layout: default
title: Maslow
grand_parent: Machines
parent: CNC
nav_order: 1
---

# Maslow

The Maslow is a unique CNC machine due to its hanging-chain design.

## Calibration

The Maslow requires calibration to correct "chain sag" (catenary effects).

![Calibration Overview](/assets/machines/maslow/calibration_overview.png)

### Before you Begin

Test your frame! **This is extremely important**.

Use the Shuttle controls to move your sled to all 4 corners of the stock. Check that it can reach each corner easily and without obstruction. There should be no lift in the sled, no tight wires restricting movement, etc. If you have any of these common problems, do **not** attempt to calibrate. Doing so could actually make your calibration worse!

- Bowing or warping in the stock.
- Wires or obstructions preventing movement.
- Anything in the way of the sled, such as protruding wood on the frame.
- Chains not attached to the rotation disk correctly (e.g., rollers came off the disk).

_Note: rather than fixing a frame problem, you can use the Frame Settings (below) to make your machine size smaller than the standard 8 ft. x 4 ft. This will prevent the machine from attempting to access the inaccessible corners._

### Machine Settings

These options may not need to be changed, as they usually match standard Maslow kits. However, you should take a moment to review them, just in case:

- **Sled Weight**: Measured in Newtons, including the router and all.
- **Rotational Radius**: The radius from the center of the bit to where the chains attach.
- **Chain Direction**: The image above depicts `Off Bottom`. Only choose `Off Top` if the chains come off the sprockets in the opposite direction.
- **Chain Full Length**: The total length of each chain (usually 12 feet, or 3360mm).

### Frame Settings

During calibration, you should make sure that these values match the stock you have loaded. **Measure your stock!** Most plywood is exactly 8x4 feet, but it is important to be certain about these values before calibrating.

- **Width**: the width of the stock.
- **Height**: the height of the stock.

After calibration, you may change the frame settings (machine size) for different sizes of stock, as needed.

### Define Home

This step will tell the Machine where its "home" location is. Before proceeding, ensure that:

- The stock should be centered between the motors.
- The tip of the router bit should be centered on the stock (this will be X=0, Y=0).
- The tip of the router bit should be barely touching the stock (Z=0).

You may need to close the calibration dialog and move the sled to the appropriate location. Then, enter the following measurements unique to your build:

- **Motor Height**: The distance from the top of the stock to the middle of the motor's sprockets (coplanar with the stock).
- **Motor Width**: The distance between the two motors (measured from the center of each sprocket).

_**Tip**: Once you press "Define Home", use a sharpie or paint to mark exactly which link of the chain is at the top of each sprocket. If your machine ever comes out of alignment, such as if chains slip or are removed from the sprockets, you will need to return it to this "Home" position (and then press "Set Home" on the main screen of Makerverse). It is important that the chains are exactly in the same position. **Do not try to visually move the sled back to the same position** when using "Set Home." Most users simply mark the chain link which is at the 12 o'clock (noon) position on the sprocket, and then ensure that link is again at the same location before pressing "Set Home."_

### Edge Calibration

Edge calibration is a way to refine X/Y positioning without actually cutting (destroying) stock.

Both Edge and Precision calibration will use measurements to correct for chain sag and ensure that your sled is in the correct X/Y position. However, these steps may also modify your motor width and motor height to account for slight measurement errors.

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

Important: different shields require different hardware settings. You should not need to change anything with the Mega, but there are some extra steps for the Arduino Due. You may need to change the following:

- **M2** (V2 shield): Make sure **Step pulse invert** (`$3`) is set to `4` (inverts the Z-axis). Also make sure **Z-axis travel resolution** (`$102`) is set to `472.5` (scales the Z-axis).
- **V1 Shield**: You may need to change **Z-axis travel resolution** (`$102`) based upon your gear tooth ratio.
