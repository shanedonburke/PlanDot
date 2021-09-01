import express from "express";
import { createServer, ServerOptions } from "https";
import cookieParser from "cookie-parser";
import { config, readLocalFileSync } from "./utils";
import { api } from "./routers/api";

const app = express();

app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use("/api", api);
app.use('/', (req, res) => {
  res.send('Hi');
});

if (process.env.NODE_ENV === "development") {
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
} else {
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

  const server = createServer(options, app).listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });

  server.addListener("error", (err) => {
    console.error(err);
  });
}
