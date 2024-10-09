const rateLimit = require("express-rate-limit");
const RedisStore = require("rate-limit-redis").default;
const { createClient } = require("redis");
const config = require("../config");

// Create a Redis client
const redisClient = createClient({
  url: config.redisUrl,
});

// Connect to Redis
redisClient.connect().catch(console.error);

const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args), // Adapt for node-redis
    client: redisClient,
    prefix: "rate_limit:",
  }),
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: "Too many requests, please try again later.",
  headers: true,
});

module.exports = limiter;
