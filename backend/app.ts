import express from "express";
import { createServer } from 'https';
import { readFileSync } from "fs";
import cookieParser from "cookie-parser";
import { config } from "./config";
import { api } from "./routers/api";
import { homedir } from "os";
import { join } from "path";

const app = express();

app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use("/api", api);

const serverOptions = {
  key: readFileSync(join(homedir(), ".plandot", "ssl.pem"), "utf8"),
  cert: readFileSync(join(homedir(), ".plandot", "ssl.crt"), "utf8"),
}

const server = createServer(serverOptions, app).listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
