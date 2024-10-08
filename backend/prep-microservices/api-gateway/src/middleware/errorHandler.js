const logger = require("../utils/logger");
const { formatErrorResponse } = require("../utils/responseFormatter");

module.exports = (err, req, res, next) => {
  logger.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json(formatErrorResponse(message, statusCode));
};
