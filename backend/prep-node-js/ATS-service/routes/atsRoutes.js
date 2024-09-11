const express = require("express");
const atsController = require("../controllers/atsController");

const router = express.Router();

router.post("/check-ats-score", atsController.checkAtsScore);
router.get("/history/:userId", atsController.getAtsScoreHistory);

module.exports = router;
