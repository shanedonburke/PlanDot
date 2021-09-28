import cookieParser from "cookie-parser";
import express from "express";
import compression from "compression";
import { api } from "./routers/api";

export const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(compression());
app.use("/", express.static("public"));
app.use("/api", api);
