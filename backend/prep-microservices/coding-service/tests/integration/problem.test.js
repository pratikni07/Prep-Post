const request = require("supertest");
const { expect } = require("chai");
const app = require("../../src/app");
const Problem = require("../../src/models/Problem");
const mongoose = require("mongoose");

describe("Problem API", () => {
  before(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });

  describe("GET /api/problems", () => {
    it("should return a list of problems", async () => {
      const res = await request(app).get("/api/problems");
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("problems");
      expect(res.body.problems).to.be.an("array");
    });
  });

  // Add more integration tests for other endpoints
});
