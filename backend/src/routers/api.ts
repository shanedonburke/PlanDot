import { Request, Router } from "express";
import { Credentials, OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { UserData } from "../schemas/user-data";
import { getConfig, isDevProfile } from "../utils";

/**
 * @returns An OAuth2Client instance with details from the configuration.
 */
function getOAuth2Client(): OAuth2Client {
  const config = getConfig();

  return new google.auth.OAuth2(
    config.oauth2Credentials.clientId,
    config.oauth2Credentials.clientSecret,
    config.oauth2Credentials.redirectUri
  );
}

/**
 * Retrieves a user's ID from the JWT cookie on their request.
 * @param req The request object.
 * @returns The user's ID
 */
function getUserId(req: Request): string {
  const config = getConfig();

  const oAuth2Client = getOAuth2Client();
  oAuth2Client.credentials = <Credentials>(
    jwt.verify(req.cookies.jwt, config.jwtSecret)
  );
  return <string>jwt.decode(oAuth2Client.credentials.id_token).sub;
}

/** Router for the `/api` route. */
export const api = Router();

/**
 * Responds with an OAuth2 authentication URL to which the user should
 * be redirected for login.
 */
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

/**
 * Saves user data (groups and items) under the user's ID.
 */
api.post("/user_data", (req, res) => {
  if (req.cookies.jwt) {
    UserData.findOneAndUpdate(
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

/**
 * Retrieves user data (groups and items) by the user's ID.
 */
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

/**
 * The authentication callback provided to Google OAuth2. The user is
 * redirected here after logging in with their Google account.
 */
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

/**
 * Logs the user out by deleting their JWT cookie.
 */
api.get("/logout", (_, res) => {
  res.clearCookie("jwt");
  res.redirect("/");
});
