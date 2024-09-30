// coding-service/routes/coding.js
const express = require("express");
const router = express.Router();
const CodingProblem = require("../models/CodingProblem");
const { body, validationResult } = require("express-validator");

router.post(
  "/submit",
  [
    body("userId").notEmpty().withMessage("User ID is required"),
    body("problemId").notEmpty().withMessage("Problem ID is required"),
    body("code").notEmpty().withMessage("Code is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { userId, problemId, code } = req.body;
      const problem = await CodingProblem.findById(problemId);
      if (!problem) {
        return res.status(404).json({ msg: "Problem not found" });
      }

      // Add job to queue for processing
      const job = await codeExecutionQueue.add({
        userId,
        problemId,
        code,
        testCases: problem.testCases,
      });

      res.json({ jobId: job.id, message: "Code execution job added to queue" });
    } catch (err) {
      logger.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.get("/result/:jobId", async (req, res) => {
  try {
    const job = await codeExecutionQueue.getJob(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.isCompleted()) {
      return res.json(job.returnvalue);
    } else {
      return res.json({ message: "Job still processing" });
    }
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/problem/:id", async (req, res) => {
  try {
    const problem = await CodingProblem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ msg: "Problem not found" });
    }
    res.json(problem);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
