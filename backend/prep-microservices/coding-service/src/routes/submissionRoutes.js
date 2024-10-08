const express = require("express");
const {
  submitSolution,
  getSubmission,
  getUserSubmissions,
} = require("../controllers/submissionController");

const router = express.Router();

router.post("/", submitSolution);
router.get("/:id", getSubmission);
router.get("/", getUserSubmissions);

module.exports = router;
