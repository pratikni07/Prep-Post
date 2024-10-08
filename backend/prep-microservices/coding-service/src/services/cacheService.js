const Redis = require("ioredis");
const config = require("../config");

const redis = new Redis(config.redisUrl);

async function cacheSet(key, value, expirationInSeconds = 3600) {
  await redis.set(key, JSON.stringify(value), "EX", expirationInSeconds);
}

async function cacheGet(key) {
  const value = await redis.get(key);
  return value ? JSON.parse(value) : null;
}

async function cacheDelete(key) {
  await redis.del(key);
}

module.exports = {
  cacheSet,
  cacheGet,
  cacheDelete,
};
