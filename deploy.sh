( cd frontend ; ng build --prod )
cp -r frontend/dist/* backend/public/
cd backend
node app.ts