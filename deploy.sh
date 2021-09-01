#!/bin/bash -e

export NODE_OPTIONS="--max_old_space_size=8192"

( cd frontend && ng build || exit 1 )
cp -r frontend/dist/* backend/public/
( cd backend && node app.ts || exit 1 )