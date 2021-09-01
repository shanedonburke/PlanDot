import express from "express";
import cookieParser from "cookie-parser";
import { config } from "./config";
import { api } from "./routers/api";

const app = express();

app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
app.use("/api", api);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
