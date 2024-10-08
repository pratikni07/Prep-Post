const Redis = require("ioredis");
const config = require("./index");
const logger = require("../utils/logger");

const redisClient = new Redis(config.redisUrl);

const connectRedis = async () => {
  try {
    await redisClient.ping();
    logger.info("Connected to Redis");
  } catch (error) {
    logger.error("Failed to connect to Redis", error);
  }
};

module.exports = { connectRedis, redisClient };
