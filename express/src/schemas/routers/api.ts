import { Request, Router } from "express";
import { Credentials, OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { UserData } from "../user-data";
import { getConfig, isDevProfile } from "../../utils";

function getOAuth2Client(): OAuth2Client {
  const config = getConfig();

  return new google.auth.OAuth2(
    config.oauth2Credentials.clientId,
    config.oauth2Credentials.clientSecret,
    config.oauth2Credentials.redirectUri
  );
}

function getUserId(req: Request): string {
  const config = getConfig();

  const oAuth2Client = getOAuth2Client();
  oAuth2Client.credentials = <Credentials>(
    jwt.verify(req.cookies.jwt, config.jwtSecret)
  );
  return <string>jwt.decode(oAuth2Client.credentials.id_token).sub;
}

export const api = Router();

api.get("/auth_url", (_, res) => {
  const config = getConfig();

  const oAuth2Client = getOAuth2Client();
  res.send(
    oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: config.oauth2Credentials.scope,
    })
  );
});

api.post("/user_data", (req, res) => {
  if (req.cookies.jwt) {
    UserData.findByIdAndUpdate(
      { _id: getUserId(req) },
      req.body,
      {
        upsert: true,
        projection: { _id: false },
      },
      (err, _) => {
        if (err) return res.sendStatus(500);
        return res.sendStatus(200);
      }
    );
  }
});

api.get("/user_data", (req, res) => {
  if (req.cookies.jwt) {
    UserData.findOne({ _id: getUserId(req) }).then(
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

  const oAuth2Client = getOAuth2Client();

  if (req.query.error) {
    // The user did not give us permission
    return res.redirect(redirectUrl);
  } else {
    oAuth2Client.getToken(<string>req.query.code, function (err, token) {
      if (err) return res.redirect(redirectUrl);

      res.cookie("jwt", jwt.sign(token, config.jwtSecret));
      return res.redirect(redirectUrl);
    });
  }
});

api.get("/logout", (_, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});
