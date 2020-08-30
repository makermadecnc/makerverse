#!/bin/bash
# Setup script error handling see https://disconnected.systems/blog/another-bash-strict-mode for details
set -uo pipefail
trap 's=$?; echo "$0: Error on line "$LINENO": $BASH_COMMAND"; exit $s' ERR
IFS=$'\n\t'

# Ensure we are root
if [[ $EUID -ne 0 ]]; then
    echo "This script must be run as root" 1>&2
    exit 1
fi

# Some useful constants
mount="mnt" # Local directory to mount the image (automatically created/delete as needed)
script="setup" # Local setup script to run inside the image
rpi_tar="ArchLinuxARM-rpi-latest.tar.gz" # Raspberry pi 1 image others can be found on https://archlinuxarm.org/
rpi_url="http://archlinuxarm.org/os/${rpi_tar}"

# Grab the first two arguments, using the defaults if not set
# This allows running the command as any of
#   ./create-image                 # to use the defaults
#   ./create-image 4G              # create a 4 gig image instead of 2 gig
#   ./create-image 4G myname.img   # create a 4 gig image called myname.img
size="${1:-2G}"
image="${2:-rpizw-rover.img}"

# Tasks to run when the shell exits for any reason, unmount the image and
# general cleanup
cleanup() {
    [[ -f "${mount}/tmp/${script}" ]] && rm "${mount}/tmp/${script}"
    if [[ -d "${mount}" ]]; then
        umount "${mount}/dev" || true
        umount "${mount}/proc" || true
        umount "${mount}/sys" || true
        umount "${mount}/boot" || true
        umount "${mount}" || true
        rmdir "${mount}" || true
    fi
    [ -n "${loopdev}" ] && losetup --detach "${loopdev}" || true
}
trap cleanup EXIT

# Download archlinux arm only if we have not already done so
[ ! -f "${rpi_tar}" ] && wget "${rpi_url}"

# Create, partition and format the image
fallocate -l "${size}" "${image}"
loopdev=$(losetup --find --show "${image}")
parted --script "${loopdev}" mklabel msdos
parted --script "${loopdev}" mkpart primary fat32 0% 100M
parted --script "${loopdev}" mkpart primary ext4 100M 100%
bootdev=$(ls "${loopdev}"*1)
rootdev=$(ls "${loopdev}"*2)
mkfs.vfat -F32 ${bootdev}
mkfs.ext4 -F ${rootdev}

# Mount the image
[ ! -d "${mount}" ] && mkdir "${mount}"
mount "${rootdev}" "${mount}"
[ ! -d "${mount}/boot" ] && mkdir "${mount}/boot"
mount "${bootdev}" "${mount}/boot"

# Install archlinuxarm to the image
tar -xpf "${rpi_tar}" -C ${mount} 2> >(grep -v "Ignoring unknown extended header keyword")

# Copy our installation script to the mount so it can be run in the chroot
install -Dm755 "${script}" "${mount}/tmp/${script}"

# Prep the chroot
mount -t proc none ${mount}/proc
mount -t sysfs none ${mount}/sys
mount -o bind /dev ${mount}/dev
rm ${mount}/etc/resolv.conf
cp /etc/resolv.conf ${mount}/etc/resolv.conf
cp /usr/bin/qemu-arm-static ${mount}/usr/bin/

# Run the setup script inside the chroot
chroot ${mount}  "/tmp/${script}"
