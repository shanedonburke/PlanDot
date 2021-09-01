#!/bin/bash -e

( cd frontend ; ng build )
cp -r frontend/dist/* backend/public/
cd backend
node app.ts