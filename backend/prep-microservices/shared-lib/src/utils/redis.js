const Redis = require("ioredis");
const logger = require("./logger");

const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  enableReadyCheck: true,
  maxRetriesPerRequest: 3,
});

redisClient.on("error", (error) => {
  logger.error("Redis error:", error);
});

redisClient.on("connect", () => {
  logger.info("Connected to Redis");
});

module.exports = redisClient;
