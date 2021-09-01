#!/bin/bash -e

if [ -f /lib/systemd/system/plandot.service ]; then
  systemctl stop plandot
fi

( cd frontend && ng build || exit 1 )
mkdir -p backend/public && cp -r frontend/dist/* backend/public/
cp plandot.service /lib/systemd/system/plandot.service
sudo systemctl daemon-reload
sudo systemctl start plandot
