const express = require("express");
const problemRoutes = require("./problemRoutes");
const submissionRoutes = require("./submissionRoutes");
const { authenticateJWT } = require("../middleware/auth");

const router = express.Router();

router.use("/problems", authenticateJWT, problemRoutes);
router.use("/submissions", authenticateJWT, submissionRoutes);

module.exports = router;
