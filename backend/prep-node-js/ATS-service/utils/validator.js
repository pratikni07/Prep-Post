const mongoose = require("mongoose");

exports.validateAtsInput = (userId, resumeText, jobDescription) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return "Invalid userId";
  }
  if (
    !resumeText ||
    typeof resumeText !== "string" ||
    resumeText.trim().length === 0
  ) {
    return "Invalid resumeText";
  }
  if (
    !jobDescription ||
    typeof jobDescription !== "string" ||
    jobDescription.trim().length === 0
  ) {
    return "Invalid jobDescription";
  }
  return null;
};
