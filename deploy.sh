#!/bin/bash -e

( cd frontend && ng build || exit 1 )
mkdir -p backend/public && cp -r frontend/dist/* backend/public/
cp plandot.service /lib/systemd/system/plandot.service
sudo systemctl daemon-reload
sudo systemctl start plandot
