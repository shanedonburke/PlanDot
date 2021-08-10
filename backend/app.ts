import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bodyParser from 'body-parser';
import { google } from "googleapis";
import { CONFIG } from "./config";
import { api } from "./routers/api";

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use("/api", api);

app.get("/auth_callback", (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    CONFIG.oauth2Credentials.clientId,
    CONFIG.oauth2Credentials.clientSecret,
    CONFIG.oauth2Credentials.redirectUris[0]
  );

  if (req.query.error) {
    // The user did not give us permission.
    return res.redirect("/");
  } else {
    oauth2Client.getToken(<string>req.query.code, function (err, token) {
      if (err) return res.redirect("/");

      res.cookie("jwt", jwt.sign(token, CONFIG.jwtSecret));
      return res.redirect("http://localhost:4200");
    });
  }
});

app.listen(CONFIG.port, () => {
  console.log(
    `Timezones by location application is running on port ${CONFIG.port}.`
  );
});
