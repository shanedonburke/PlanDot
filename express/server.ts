import { Server } from 'http';
import { createServer, ServerOptions } from 'https';
import { app } from './app';
import { getConfig, isDevProfile, readLocalFileSync } from './utils';

const server = isDevProfile() ? startDevServer() : startProdServer();

server.addListener('error', (err) => {
  console.error(err);
});

function startDevServer(): Server {
  const config = getConfig();
  return app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
}

function startProdServer(): Server {
  console.log('Attempting to read SSL certificate files...');

  const options: ServerOptions = {
    key: readLocalFileSync('plandot.app.key'),
    cert: readLocalFileSync('plandot.app.crt'),
    ca: [
      readLocalFileSync('cert_1.crt'),
      readLocalFileSync('cert_2.crt'),
      readLocalFileSync('cert_3.crt'),
    ],
  };
  console.log('Successfully read SSL certificate files.');

  const config = getConfig();
  return createServer(options, app).listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
}
