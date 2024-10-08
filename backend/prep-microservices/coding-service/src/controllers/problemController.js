const Problem = require("../models/Problem");
const { validateProblem } = require("../utils/validators");
const { cacheSet, cacheGet } = require("../services/cacheService");
const logger = require("../utils/logger");

exports.createProblem = async (req, res, next) => {
  try {
    const { error } = validateProblem(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const problem = new Problem({
      ...req.body,
      createdBy: req.user._id,
    });

    await problem.save();
    logger.info(`New problem created: ${problem.title}`);
    res.status(201).json(problem);
  } catch (error) {
    logger.error("Error creating problem:", { error: error.message });
    next(error);
  }
};

exports.getProblems = async (req, res, next) => {
  try {
    const { topic, difficulty, page = 1, limit = 10 } = req.query;
    const cacheKey = `problems:${topic}:${difficulty}:${page}:${limit}`;

    let cachedResult = await cacheGet(cacheKey);
    if (cachedResult) {
      logger.info("Serving problems from cache");
      return res.json(cachedResult);
    }

    const query = {};
    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;

    const problems = await Problem.find(query)
      .select("-testCases")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Problem.countDocuments(query);

    const result = {
      problems,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    };

    await cacheSet(cacheKey, result, 300); // Cache for 5 minutes
    logger.info("Problems fetched and cached");

    res.json(result);
  } catch (error) {
    logger.error("Error fetching problems:", { error: error.message });
    next(error);
  }
};

exports.getProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findById(req.params.id).select("-testCases");
    if (!problem) {
      logger.warn(`Problem not found: ${req.params.id}`);
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json(problem);
  } catch (error) {
    logger.error("Error fetching problem:", { error: error.message });
    next(error);
  }
};

exports.updateProblem = async (req, res, next) => {
  try {
    const { error } = validateProblem(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!problem) {
      logger.warn(`Problem not found for update: ${req.params.id}`);
      return res.status(404).json({ message: "Problem not found" });
    }
    logger.info(`Problem updated: ${problem.title}`);
    res.json(problem);
  } catch (error) {
    logger.error("Error updating problem:", { error: error.message });
    next(error);
  }
};

exports.deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);
    if (!problem) {
      logger.warn(`Problem not found for deletion: ${req.params.id}`);
      return res.status(404).json({ message: "Problem not found" });
    }
    logger.info(`Problem deleted: ${problem.title}`);
    res.json({ message: "Problem deleted successfully" });
  } catch (error) {
    logger.error("Error deleting problem:", { error: error.message });
    next(error);
  }
};
