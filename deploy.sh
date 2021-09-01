#!/bin/bash -e

( cd frontend && ng build || exit 1 )
mkdir -p backend/public && cp -r frontend/dist/* backend/public/
( cd backend && npm start || exit 1 )
