#!/bin/bash -e

SERVICE_FILE=/lib/systemd/system/plandot.service

if [ -f $SERVICE_FILE ]; then
  systemctl stop plandot
fi

( cd frontend && ng build || exit 1 )
mkdir -p backend/public && cp -r frontend/dist/* backend/public/
cp plandot.service $SERVICE_FILE
sudo systemctl daemon-reload
sudo systemctl start plandot
