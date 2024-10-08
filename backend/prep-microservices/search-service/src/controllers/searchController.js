const searchService = require("../services/searchService");
const logger = require("../utils/logger");

exports.search = async (req, res, next) => {
  try {
    const { query, type, page = 1, limit = 10 } = req.query;
    const results = await searchService.search(query, type, page, limit);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    logger.error("Error in search controller", error);
    next(error);
  }
};

exports.indexData = async (req, res, next) => {
  try {
    const { type, data } = req.body;
    await searchService.indexData(type, data);
    res
      .status(200)
      .json({ success: true, message: "Data indexed successfully" });
  } catch (error) {
    logger.error("Error in indexData controller", error);
    next(error);
  }
};
