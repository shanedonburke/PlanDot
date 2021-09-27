import { OAuth2Client } from "google-auth-library";
import mongoose from "mongoose";
import request from "supertest";
import YAML from "yaml";
import jwt from "jsonwebtoken";
import { app } from "./app";
import { google } from "googleapis";
import { UserData } from "./schemas/user-data";

describe("App", () => {
  const AUTH_URL = "https://auth.com";
  const ANGULAR_DEV_URL = "http://localhost:4200/app";
  const JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  let OLD_NODE_ENV: string;

  beforeAll((done) => {
    mongoose
      .connect("mongodb://localhost:27017/plandot_test")
      .then(() => done(), done);
  });

  beforeEach(() => {
    setup();
    OLD_NODE_ENV = process.env.NODE_ENV;
  });

  afterEach((done) => {
    process.env.NODE_ENV = OLD_NODE_ENV;
    mongoose.connection.db.dropCollection("userdatas").then(
      () => done(),
      () => done()
    );
  });

  afterAll((done) => {
    mongoose.connection.close(done);
  });

  it("GET /", () => {
    return request(app).get("/").expect(302).expect("Location", "/app");
  });

  it("GET /api/auth_url", () => {
    return request(app).get("/api/auth_url").expect(200).expect(AUTH_URL);
  });

  it("GET /api/auth_callback (dev profile)", () => {
    process.env.NODE_ENV = "dev";
    return request(app)
      .get("/api/auth_callback")
      .expect(302)
      .expect("Location", ANGULAR_DEV_URL)
      .then(() => {
        expect(jwt.sign).toHaveBeenCalled();
      });
  });

  it("GET /api/auth_callback (prod profile)", () => {
    process.env.NODE_ENV = "prod";
    return request(app)
      .get("/api/auth_callback")
      .expect(302)
      .expect("Location", "/")
      .then(() => {
        expect(jwt.sign).toHaveBeenCalled();
      });
  });

  it("GET /api/user_data (has auth)", () => {
    return request(app)
      .get("/api/user_data")
      .set("Cookie", `jwt=${JWT}`)
      .expect(200)
      .expect({
        groups: [],
        items: [],
      });
  });

  it("GET /api/user_data (no auth)", () => {
    return request(app).get("/api/user_data").expect(200).expect({});
  });

  it("GET /api/user_data (no user data)", () => {
    (UserData.findOne as jest.Mock).mockResolvedValue(null);
    return request(app)
      .get("/api/user_data")
      .set("Cookie", `jwt=${JWT}`)
      .expect(200)
      .expect({});
  });

  it("POST /api/user_data", () => {
    return request(app)
      .post("/api/user_data")
      .set("Cookie", `jwt=${JWT}`)
      .send({
        groups: [],
        items: [],
      })
      .expect(200)
      .then(() => {
        expect(UserData.findOneAndUpdate).toHaveBeenCalled();
      });
  });

  it("GET /api/logout", () => {
    return request(app)
      .get("/api/logout")
      .set("Cookie", `jwt=${JWT}`)
      .expect(302)
      .expect("Location", "/")
      .expect(
        "Set-Cookie",
        "jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
      );
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
    jest.spyOn(jwt, "verify").mockImplementation((_, __) => {
      return { id_token: "id_token" };
    });
    jest.spyOn(jwt, "decode").mockReturnValue({ sub: "someid" });
    jest.spyOn(UserData, "findOne").mockResolvedValue(new UserData({}));
    jest.spyOn(UserData, "findOneAndUpdate");
  }
});
