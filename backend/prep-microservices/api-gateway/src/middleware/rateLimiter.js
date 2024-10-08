const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis");
const Redis = require("ioredis");
const config = require("../config");

const redisClient = new Redis(config.redisUrl);

const limiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: "rate_limit:",
  }),
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: "Too many requests, please try again later.",
  headers: true,
});

module.exports = limiter;
