import cookieParser from "cookie-parser";
import express from "express";
import { api } from "./routers/api";

export const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/api", api);
app.use(express.static("public"));