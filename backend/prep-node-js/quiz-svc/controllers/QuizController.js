// controllers/quizController.js
const Quiz = require("../models/Quiz");
const redis = require("redis");
const { promisify } = require("util");

// Create Redis client
const redisClient = redis.createClient(process.env.REDIS_URL);
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

// Cache duration in seconds
const CACHE_DURATION = 3600; // 1 hour

exports.createQuiz = async (req, res) => {
  try {
    const { title, description, company, topic, subTopic, type, questions } =
      req.body;
    const quiz = new Quiz({
      title,
      description,
      company,
      topic,
      subTopic,
      type,
      questions,
      createdBy: req.user._id, // Assuming you have authentication middleware
    });
    await quiz.save();

    // Invalidate cache
    await redisClient.del("quizzes");

    res.status(201).json({ success: true, data: quiz });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getQuizzes = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const sortBy = req.query.sortBy || "createdDate";
    const order = req.query.order === "asc" ? 1 : -1;

    const cacheKey = `quizzes:${page}:${limit}:${sortBy}:${order}`;

    // Try to get data from cache
    const cachedData = await getAsync(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // If not in cache, fetch from database
    const options = {
      page,
      limit,
      sort: { [sortBy]: order },
      populate: [
        { path: "company", select: "name" },
        { path: "topic", select: "title" },
        { path: "subTopic", select: "title" },
        { path: "createdBy", select: "name email" },
      ],
      lean: true,
    };

    const result = await Quiz.paginate(
      { visibility: true, type: "public" },
      options
    );

    const response = {
      success: true,
      data: result.docs,
      pagination: {
        total: result.totalDocs,
        limit: result.limit,
        page: result.page,
        pages: result.totalPages,
      },
    };

    // Cache the result
    await setAsync(cacheKey, JSON.stringify(response), "EX", CACHE_DURATION);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const cacheKey = `quiz:${req.params.id}`;

    // Try to get data from cache
    const cachedData = await getAsync(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // If not in cache, fetch from database
    const quiz = await Quiz.findById(req.params.id)
      .populate("company", "name")
      .populate("topic", "title")
      .populate("subTopic", "title")
      .populate("createdBy", "name email")
      .populate("questions")
      .lean();

    if (!quiz) {
      return res.status(404).json({ success: false, error: "Quiz not found" });
    }

    const response = { success: true, data: quiz };

    // Cache the result
    await setAsync(cacheKey, JSON.stringify(response), "EX", CACHE_DURATION);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!quiz) {
      return res.status(404).json({ success: false, error: "Quiz not found" });
    }

    // Invalidate cache
    await redisClient.del(`quiz:${req.params.id}`);
    await redisClient.del("quizzes");

    res.status(200).json({ success: true, data: quiz });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, error: "Quiz not found" });
    }

    // Invalidate cache
    await redisClient.del(`quiz:${req.params.id}`);
    await redisClient.del("quizzes");

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = exports;
