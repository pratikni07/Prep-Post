const Coding = require("../models/Coding");
const { redis, producer, io } = require("../config/setup");
const CodeExecutionService = require("../services/CodeExecutionService");

exports.getAllCodingProblems = async (req, res) => {
  try {
    const { page = 1, limit = 20, difficulty, topic } = req.query;
    const cacheKey = `problems:${page}:${limit}:${difficulty}:${topic}`;

    const cachedProblems = await redis.get(cacheKey);
    if (cachedProblems) {
      return res.json(JSON.parse(cachedProblems));
    }

    const query = {};
    if (difficulty) query.difficulty = difficulty;
    if (topic) query.topics = topic;

    const problems = await Coding.find(query)
      .select("-solutionCode")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();

    const total = await Coding.countDocuments(query);

    const result = {
      problems,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };

    await redis.set(cacheKey, JSON.stringify(result), "EX", 3600); // Cache for 1 hour

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching coding problems",
      error: error.message,
    });
  }
};

exports.getCodingProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `problem:${id}`;

    const cachedProblem = await redis.get(cacheKey);
    if (cachedProblem) {
      return res.json(JSON.parse(cachedProblem));
    }

    const problem = await Coding.findById(id).select("-solutionCode").lean();
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    await redis.set(cacheKey, JSON.stringify(problem), "EX", 3600); // Cache for 1 hour
    await Coding.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.json(problem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching coding problem", error: error.message });
  }
};

exports.createCodingProblem = async (req, res) => {
  try {
    const newProblem = new Coding(req.body);
    await newProblem.save();

    // Publish event to Kafka
    await producer.send({
      topic: "new-problem",
      messages: [{ value: JSON.stringify(newProblem) }],
    });

    // Emit real-time update
    io.emit("new-problem", newProblem);

    res.status(201).json(newProblem);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating coding problem", error: error.message });
  }
};

exports.runSolution = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const problem = await Coding.findById(problemId);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Execute the code with the first 3 test cases
    const result = await CodeExecutionService.executeCode(
      code,
      language,
      problem.testCases,
      false
    );

    res.json({
      results: result,
      totalTestCases: problem.testCases.length,
      executedTestCases: result.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error running solution", error: error.message });
  }
};

exports.submitSolution = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const problem = await Coding.findById(problemId);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Execute the code with all test cases
    const result = await CodeExecutionService.executeCode(
      code,
      language,
      problem.testCases,
      true
    );

    // Check if the solution passes all test cases
    const allTestsPassed = result.every((testResult) => testResult.passed);

    // Update problem statistics
    await Coding.findByIdAndUpdate(problemId, {
      $inc: { totalSubmissions: 1 },
      ...(allTestsPassed && {
        $addToSet: { solvedBy: req.user._id },
        $inc: { successfulSubmissions: 1 },
      }),
    });

    if (allTestsPassed) {
      // Update user statistics
      await req.user.updateOne({
        $addToSet: { problemsSolved: problemId },
      });

      // Publish event to Kafka
      await producer.send({
        topic: "problem-solved",
        messages: [
          { value: JSON.stringify({ problemId, userId: req.user._id }) },
        ],
      });
      io.emit("problem-solved", { problemId, userId: req.user._id });
    }

    res.json({
      success: allTestsPassed,
      results: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error submitting solution", error: error.message });
  }
};
