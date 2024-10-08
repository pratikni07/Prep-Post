const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const redis = require("../utils/redis");

const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      client: redis,
      prefix: "rate_limit:",
    }),
  };

  return rateLimit({
    ...defaultOptions,
    ...options,
  });
};

module.exports = createRateLimiter;
