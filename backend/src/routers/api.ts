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
async function getUserId(req: Request): Promise<string> {
  return new Promise((resolve, reject) => {
    const config = getConfig();
    const oAuth2Client = getOAuth2Client();

    jwt.verify(req.cookies.jwt, config.jwtSecret, (err, decoded) => {
      if (err) reject("Invalid JWT");

      oAuth2Client.credentials = <Credentials>decoded;
      resolve(<string>jwt.decode(oAuth2Client.credentials.id_token).sub);
    });
  });
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
api.post("/user_data", async (req, res) => {
  if (req.cookies.jwt) {
    getUserId(req)
      .then((userId) => {
        UserData.findOneAndUpdate({ _id: userId }, req.body, {
          upsert: true,
          projection: { _id: false },
        })
          .then(() => res.sendStatus(200))
          .catch(() => res.sendStatus(400));
      })
      .catch(() => {
        res.clearCookie("jwt");
        res.sendStatus(401)
      });
  } else {
    res.sendStatus(401);
  }
});

/**
 * Retrieves user data (groups and items) by the user's ID.
 */
api.get("/user_data", async (req, res) => {
  if (req.cookies.jwt) {
    getUserId(req)
      .then((userId) => {
        UserData.findOne({ _id: userId }, { _id: false })
          .then((userData) => res.send(userData))
          .catch(() => res.send({}));
      })
      .catch(() => {
        res.clearCookie("jwt");
        res.send({});
      })
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

      res.cookie("jwt", jwt.sign(token, config.jwtSecret), {
        // Expire in 1 year if no expiry date is given
        maxAge: ((token.expiry_date - Date.now()) || 31536000000) / 1000,
      });
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
