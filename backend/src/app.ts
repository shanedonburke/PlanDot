import cookieParser from "cookie-parser";
import express from "express";
import path from "path";
import { api } from "./routers/api";

export const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/", express.static("public"));
app.use("/api", api);
