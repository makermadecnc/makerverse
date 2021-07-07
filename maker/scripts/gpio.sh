#!/bin/bash
# Script for turning on/off GPIO pins on the Raspberry Pi
pin="${1}"
flag="${2:-0}"
echo "w ${pin} ${flag}" > /dev/pigpio
