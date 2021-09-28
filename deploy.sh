#!/bin/bash -e

SERVICE_FILE=/lib/systemd/system/plandot.service

( cd frontend && ng build || exit 1 )

mkdir -p backend/public
cp -r frontend/dist/* backend/public/

if [ -f $SERVICE_FILE ]; then
  systemctl stop plandot
fi

cp plandot.service $SERVICE_FILE
systemctl daemon-reload
systemctl start plandot
