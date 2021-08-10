import { Request, Router } from "express";
import { Db, MongoClient } from "mongodb";
import { Credentials } from "google-auth-library";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { CONFIG } from "../config";

let db: Db;
MongoClient.connect("mongodb://localhost:27017", (_, client) => {
  db = client.db("plan0");
});

function getUserId(req: Request): string {
  const oauth2Client = new google.auth.OAuth2(
    CONFIG.oauth2Credentials.clientId,
    CONFIG.oauth2Credentials.clientSecret,
    CONFIG.oauth2Credentials.redirectUris[0]
  );
  oauth2Client.credentials = <Credentials>(
    jwt.verify(req.cookies.jwt, CONFIG.jwtSecret)
  );
  return <string>jwt.decode(oauth2Client.credentials.id_token).sub;
}

export const api = Router();

api.get("/auth_url", (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    CONFIG.oauth2Credentials.clientId,
    CONFIG.oauth2Credentials.clientSecret,
    CONFIG.oauth2Credentials.redirectUris[0]
  );
  res.send(
    oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: CONFIG.oauth2Credentials.scope,
    })
  );
});

api.post("/user_data", (req, res) => {
  db.collection("userData").updateOne(
    { _id: getUserId(req) },
    { $set: req.body },
    { upsert: true }
  );
  res.sendStatus(200);
});

api.get("/user_data", (req, res) => {
  db.collection("userData").findOne({ _id: getUserId(req) }).then(
    (doc) => res.send(doc),
    (err) => res.send(err),
  );
});
