const { expect } = require("chai");
const sinon = require("sinon");
const { createProblem } = require("../../src/controllers/problemController");
const Problem = require("../../src/models/Problem");

describe("Problem Controller", () => {
  describe("createProblem", () => {
    it("should create a new problem", async () => {
      const req = {
        body: {
          title: "Test Problem",
          description: "This is a test problem",
          difficulty: "Easy",
          topic: "Arrays",
          sampleTestCases: [{ input: "1 2", expectedOutput: "3" }],
          testCases: [{ input: "1 2", expectedOutput: "3" }],
        },
        user: { _id: "user123" },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
      const next = sinon.stub();

      const saveStub = sinon.stub(Problem.prototype, "save").resolves();

      await createProblem(req, res, next);

      expect(saveStub.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      saveStub.restore();
    });
  });
});
