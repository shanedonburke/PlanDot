import cookieParser from "cookie-parser";
import express from "express";
import { Server } from "http";
import { createServer, ServerOptions } from "https";
import { api } from "./routers/api";
import { getConfig, isDevProfile, readLocalFileSync } from "./utils";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/api", api);

const server = isDevProfile() ? startDevServer() : startProdServer();

server.addListener("error", (err) => {
  console.error(err);
});

function startDevServer(): Server {
  const config = getConfig();
  return app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
}

function startProdServer(): Server {
  app.use(express.static("public"));

  console.log('Attempting to read SSL certificate files...');

  const options: ServerOptions = {
    key: readLocalFileSync("plandot.app.key"),
    cert: readLocalFileSync("plandot.app.crt"),
    ca: [
      readLocalFileSync("gd1.crt"),
      readLocalFileSync("gd2.crt"),
      readLocalFileSync("gd3.crt"),
    ],
  };
  console.log('Successfully read SSL certificate files.');

  const config = getConfig();
  return createServer(options, app).listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
}
