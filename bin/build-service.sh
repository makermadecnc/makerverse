#!/bin/bash
un="$2"
echo "Makerverse Server will be controlled by $un"

sv="makerverse.service"
wd="$(pwd)"
lf="${wd}/bin/launch"
if [[ ! -f "$lf" ]]; then
  echo "Could not find launch file at $lf"
  exit 1
fi

cmd="sudo systemctl"
sd="/etc/systemd/system"

sf="$sd/$sv"
if [ "$1" = "stop" ] || [ "$1" = "install" ]; then
  systemctl $uf stop makerverse
  systemctl $uf disable makerverse
fi
if [[ -f "$sf" ]]; then
  if [ "$1" = "stop" ] || [ "$1" = "install" ]; then
    rm -rf $sf
  fi
fi

if [ "$1" = "install" ]; then
  mkdir -p "$sd"
  usermod -aG docker "$un"

  echo "[Unit]" >> $sf
  echo "Description=Makerverse Server" >> $sf
  if [[ $(which docker) ]]; then
    echo "After=docker.service" >> $sf
  fi
  echo "After=syslog.target" >> $sf
  echo "After=network-online.target" >> $sf
  echo "Wants=syslog.service" >> $sf
  echo "" >> $sf

  echo "[Service]" >> $sf
  echo "ExecStart=runuser -l ${un} -c \"${lf}\"" >> $sf
  echo "Restart=always" >> $sf
  echo "StandardOutput=syslog" >> $sf
  echo "StandardError=syslog" >> $sf
  echo "TimeoutStopSec=10" >> $sf

  echo "" >> $sf
  echo "[Install]" >> $sf
  echo "WantedBy=multi-user.target" >> $sf
  echo "" >> $sf
fi

if [ "$1" = "install" ] || [ "$1" = "start" ]; then
  systemctl $uf daemon-reload
  systemctl $uf enable makerverse
  systemctl $uf start makerverse
  echo "Service started."
fi

systemctl $uf status makerverse
echo "-----------------------------"
echo "Check Makerverse status with '$cmd status makerverse'"
echo "Find logs with journalctl -xe"
