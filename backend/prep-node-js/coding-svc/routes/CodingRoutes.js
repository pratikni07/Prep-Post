const express = require("express");
const router = express.Router();
const codingController = require("../controllers/CodingController");
const auth = require("../middleware/auth");

router.get("/problems", codingController.getAllCodingProblems);
router.get("/problems/:id", codingController.getCodingProblemById);
router.post("/problems", auth, codingController.createCodingProblem);
router.post("/submit", auth, codingController.submitSolution);

module.exports = router;
