import { expect } from "chai";
import mongoose from "mongoose";
import request from "superagent";

describe("App", () => {
  beforeEach((done) => {
    mongoose
      .connect("mongodb://localhost:27017/plandot_test")
      .then(() => done(), done);
  });

  it('GET /api/auth_url', (done) => {
    return request
      .get("/api/auth_url")
      .then((res) => {
        expect(res.status).to.equal(200);
        
        done();
      });
  });
});
