import express from "express";
import { createServer } from "https";
import { readFileSync } from "fs";
import cookieParser from "cookie-parser";
import { config, plandotDir } from "./config";
import { api } from "./routers/api";
import { join } from "path";

const app = express();

app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use("/api", api);

if (process.env.NODE_ENV === "development") {
  app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
} else {
  const options = {
    key: readFileSync(join(plandotDir, "ssl.pem"), "utf8"),
    cert: readFileSync(join(plandotDir, "ssl.crt"), "utf8"),
    ca: [
      readFileSync(join(plandotDir, "gd1.crt")),
      readFileSync(join(plandotDir, "gd2.crt")),
      readFileSync(join(plandotDir, "gd2.crt")),
    ],
  };

  const server = createServer(options, app).listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });
  server.addListener("error", (err) => {
    console.error(err);
  }
}
