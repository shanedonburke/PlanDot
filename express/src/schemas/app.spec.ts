import { OAuth2Client } from "google-auth-library";
import mongoose from "mongoose";
import request from "supertest";
import YAML from "yaml";
import jwt from "jsonwebtoken";
import { app } from "../app";
import { google } from "googleapis";

describe("App", () => {
  const AUTH_URL = "https://auth.com";
  const ANGULAR_DEV_URL = "http://localhost:4200/app";
  const JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  beforeAll((done) => {
    mongoose
      .connect("mongodb://localhost:27017/plandot_test")
      .then(() => done(), done);
  });

  beforeEach(() => {
    setup();
  });

  afterEach((done) => {
    mongoose.connection.db.dropCollection("userdatas").then(() => done(), done);
  });

  afterAll((done) => {
    mongoose.connection.close(done);
  });

  it("GET /api/auth_url", () => {
    return request(app).get("/api/auth_url").expect(200).expect(AUTH_URL);
  });

  function setup(): void {
    jest.spyOn(YAML, "parse").mockReturnValue({
      jwtSecret: "jwtSecret",
      angularDevUrl: ANGULAR_DEV_URL,
      port: 8080,
      oauth2Credentials: {
        projectId: "projectId",
        clientId: "clientId",
        clientSecret: "clientSecret",
        redirectUri: "http://localhost:8080/api/auth_callback",
        authUri: "https://accounts.google.com/o/oauth2/auth",
        tokenUri: "https://oauth2.googleapis.com/token",
        authProviderX509CertUrl: "https://www.googleapis.com/oauth2/v1/certs",
        scope: ["https://www.googleapis.com/auth/userinfo.email"],
      },
    });
    jest.spyOn(google.auth, "OAuth2").mockImplementation(() => {
      return {
        generateAuthUrl: jest.fn().mockReturnValue(AUTH_URL),
        getToken: jest.fn().mockImplementation((_, callback) => {
          callback(null, { access_token: "access_token" });
        }),
      } as unknown as OAuth2Client;
    });
    jest.spyOn(jwt, "sign").mockImplementation((_, __) => JWT);
    jest.spyOn(jwt, "verify").mockImplementation((_, __) => {});
    jest.spyOn(jwt, "decode").mockReturnValue({ sub: "someid" });
  }
});
