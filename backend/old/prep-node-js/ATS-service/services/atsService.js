const AtsScore = require("../models/AtsScore");
const logger = require("../utils/logger");
const {
  calculateAtsScore,
  generateSuggestions,
} = require("../utils/textProcessor");

exports.processAtsScore = async (userId, resumeText, jobDescription) => {
  try {
    const score = calculateAtsScore(resumeText, jobDescription);
    const suggestions = generateSuggestions(resumeText, jobDescription);

    const atsScore = new AtsScore({
      userId,
      resumeText,
      jobDescription,
      atsScore: score,
      suggestions,
    });

    await atsScore.save();
    return { score, suggestions };
  } catch (error) {
    logger.error("Error processing ATS score:", error);
    throw error;
  }
};

exports.getAtsScoreHistory = async (userId) => {
  try {
    return await AtsScore.find({ userId }).sort({ createdDate: -1 });
  } catch (error) {
    logger.error("Error fetching ATS score history:", error);
    throw error;
  }
};
