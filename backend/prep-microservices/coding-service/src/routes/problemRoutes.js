const express = require("express");
const {
  createProblem,
  getProblems,
  getProblem,
  updateProblem,
  deleteProblem,
} = require("../controllers/problemController");
const { isAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/", isAdmin, createProblem);
router.get("/", getProblems);
router.get("/:id", getProblem);
router.put("/:id", isAdmin, updateProblem);
router.delete("/:id", isAdmin, deleteProblem);

module.exports = router;
