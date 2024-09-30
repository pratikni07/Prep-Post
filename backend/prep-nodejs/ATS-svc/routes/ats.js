const express = require("express");
const router = express.Router();
const Resume = require("../models/Resume");
const { body, validationResult } = require("express-validator");

router.post(
  "/check-score",
  [
    body("resumeContent").notEmpty().withMessage("Resume content is required"),
    body("jobDescription")
      .notEmpty()
      .withMessage("Job description is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { resumeContent, jobDescription } = req.body;

      // Add job to queue for processing
      const job = await atsQueue.add({
        resumeContent,
        jobDescription,
      });

      res.json({ jobId: job.id, message: "ATS scoring job added to queue" });
    } catch (err) {
      logger.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.get("/score/:jobId", async (req, res) => {
  try {
    const job = await atsQueue.getJob(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.isCompleted()) {
      return res.json({ score: job.returnvalue });
    } else {
      return res.json({ message: "Job still processing" });
    }
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
