import express from "express";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bodyParser from 'body-parser';
import { google } from "googleapis";
import { config } from "./config";
import { api } from "./routers/api";

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use("/api", api);

app.get("/auth_callback", (req, res) => {
  const oauth2Client = new google.auth.OAuth2(
    config.oauth2Credentials.clientId,
    config.oauth2Credentials.clientSecret,
    config.oauth2Credentials.redirectUris[0]
  );

  if (req.query.error) {
    // The user did not give us permission.
    return res.redirect("/");
  } else {
    oauth2Client.getToken(<string>req.query.code, function (err, token) {
      if (err) return res.redirect("/");

      res.cookie("jwt", jwt.sign(token, config.jwtSecret));
      return res.redirect("http://localhost:4200");
    });
  }
});

app.listen(config.port, () => {
  console.log(
    `Timezones by location application is running on port ${config.port}.`
  );
});
