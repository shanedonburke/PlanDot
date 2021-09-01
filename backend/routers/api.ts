import { Request, Router } from "express";
import { Credentials } from "google-auth-library";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { Db, MongoClient } from "mongodb";
import { getConfig, isDevProfile } from "../utils";

let db: Db;
MongoClient.connect("mongodb://localhost:27017", (_, client) => {
  db = client.db("plandot");
});

function getUserId(req: Request): string {
  const config = getConfig();

  const oauth2Client = new google.auth.OAuth2(
    config.oauth2Credentials.clientId,
    config.oauth2Credentials.clientSecret,
    config.oauth2Credentials.redirectUri
  );
  oauth2Client.credentials = <Credentials>(
    jwt.verify(req.cookies.jwt, config.jwtSecret)
  );
  return <string>jwt.decode(oauth2Client.credentials.id_token).sub;
}

export const api = Router();

api.get("/auth_url", (_, res) => {
  const config = getConfig();

  const oauth2Client = new google.auth.OAuth2(
    config.oauth2Credentials.clientId,
    config.oauth2Credentials.clientSecret,
    config.oauth2Credentials.redirectUri
  );
  res.send(
    oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: config.oauth2Credentials.scope,
    })
  );
});

api.post("/user_data", (req, res) => {
  if (req.cookies.jwt) {
    db.collection("userData").updateOne(
      { _id: getUserId(req) },
      { $set: req.body },
      { upsert: true }
    );
  }
  res.sendStatus(200);
});

api.get("/user_data", (req, res) => {
  if (req.cookies.jwt) {
    db.collection("userData")
      .findOne({ _id: getUserId(req) })
      .then(
        (doc) => res.send(doc),
        (err) => res.send(err)
      );
  } else {
    res.send({});
  }
});

api.get("/auth_callback", (req, res) => {
  const config = getConfig();
  const redirectUrl = isDevProfile() ? config.angularDevUrl!! : "/";

  const oauth2Client = new google.auth.OAuth2(
    config.oauth2Credentials.clientId,
    config.oauth2Credentials.clientSecret,
    config.oauth2Credentials.redirectUri
  );

  if (req.query.error) {
    // The user did not give us permission
    return res.redirect(redirectUrl);
  } else {
    oauth2Client.getToken(<string>req.query.code, function (err, token) {
      if (err) return res.redirect(redirectUrl);

      res.cookie("jwt", jwt.sign(token, config.jwtSecret));
      return res.redirect(redirectUrl);
    });
  }
});
