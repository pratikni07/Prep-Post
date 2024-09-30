const AtsService = require("../services/atsService");
const logger = require("../utils/logger");
const { validateAtsInput } = require("../utils/validator");

exports.checkAtsScore = async (req, res) => {
  try {
    const { userId, resumeText, jobDescription } = req.body;

    // Validate input
    const validationError = validateAtsInput(
      userId,
      resumeText,
      jobDescription
    );
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const result = await AtsService.processAtsScore(
      userId,
      resumeText,
      jobDescription
    );
    res.json(result);
  } catch (error) {
    logger.error("Error in checkAtsScore:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAtsScoreHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await AtsService.getAtsScoreHistory(userId);
    res.json(history);
  } catch (error) {
    logger.error("Error in getAtsScoreHistory:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
