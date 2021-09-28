#!/bin/bash -e

SERVICE_FILE=/lib/systemd/system/plandot.service

echo "> Installing frontend packages..."
( cd frontend && npm install )

echo "> Installing backend backages..."
( cd backend && npm install )

echo "> Building frontend..."
( cd frontend && ng build || exit 1 )

echo "> Copying frontend assets..."
mkdir -p backend/public
cp -r frontend/dist/* backend/public/


if [ -f $SERVICE_FILE ]; then
  echo "> Stopping service..."
  systemctl stop plandot
fi

echo "> Creating service..."
cp plandot.service $SERVICE_FILE
systemctl daemon-reload

echo "> Starting service..."
systemctl start plandot
