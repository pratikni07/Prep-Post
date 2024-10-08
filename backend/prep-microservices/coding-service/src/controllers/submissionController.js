const Submission = require("../models/Submission");
const Problem = require("../models/Problem");
const { runCode } = require("../services/codeExecutionService");
const { validateSubmission } = require("../utils/validators");

exports.submitSolution = async (req, res, next) => {
  try {
    const { error } = validateSubmission(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { problemId, language, code } = req.body;

    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: "Problem not found" });

    const submission = new Submission({
      user: req.user._id,
      problem: problemId,
      language,
      code,
    });

    await submission.save();

    // Run code asynchronously
    runCode(submission._id, problem.testCases, language, code);

    res
      .status(202)
      .json({
        message: "Submission received and being processed",
        submissionId: submission._id,
      });
  } catch (error) {
    next(error);
  }
};

exports.getSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id).populate(
      "problem",
      "title"
    );
    if (!submission)
      return res.status(404).json({ message: "Submission not found" });
    if (submission.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(submission);
  } catch (error) {
    next(error);
  }
};

exports.getUserSubmissions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const submissions = await Submission.find({ user: req.user._id })
      .populate("problem", "title")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Submission.countDocuments({ user: req.user._id });

    res.json({
      submissions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};
