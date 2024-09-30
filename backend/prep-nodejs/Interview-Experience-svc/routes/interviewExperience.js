// interview-experience-service/routes/interviewExperience.js
const express = require("express");
const router = express.Router();
const InterviewExperience = require("../models/InterviewExperience");
const { body, validationResult } = require("express-validator");
const redis = require("../redis");

router.post(
  "/create",
  [
    body("userId").notEmpty().withMessage("User ID is required"),
    body("company").notEmpty().withMessage("Company is required"),
    body("role").notEmpty().withMessage("Role is required"),
    body("content").notEmpty().withMessage("Content is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        userId,
        company,
        role,
        content,
        relatedTopics,
        relatedQuestions,
      } = req.body;
      const interviewExperience = new InterviewExperience({
        user: userId,
        company,
        role,
        content,
        relatedTopics,
        relatedQuestions,
      });
      await interviewExperience.save();

      // Clear cache
      await redis.del("recent_experiences");

      res.json(interviewExperience);
    } catch (err) {
      logger.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.get("/:id", async (req, res) => {
  try {
    const cachedExperience = await redis.get(`experience:${req.params.id}`);
    if (cachedExperience) {
      return res.json(JSON.parse(cachedExperience));
    }

    const interviewExperience = await InterviewExperience.findById(
      req.params.id
    )
      .populate("user", "name")
      .populate("comments.user", "name");
    if (!interviewExperience) {
      return res.status(404).json({ msg: "Interview experience not found" });
    }

    // Cache the result
    await redis.set(
      `experience:${req.params.id}`,
      JSON.stringify(interviewExperience),
      "EX",
      3600
    );

    res.json(interviewExperience);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/recent", async (req, res) => {
  try {
    const cachedExperiences = await redis.get("recent_experiences");
    if (cachedExperiences) {
      return res.json(JSON.parse(cachedExperiences));
    }

    const experiences = await InterviewExperience.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("user", "name");

    // Cache the result
    await redis.set(
      "recent_experiences",
      JSON.stringify(experiences),
      "EX",
      300
    );

    res.json(experiences);
  } catch (err) {
    logger.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
