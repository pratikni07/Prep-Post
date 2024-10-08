const Redis = require("ioredis");
const config = require("../config");

class CacheService {
  constructor() {
    this.redis = new Redis(config.redisUrl);
  }

  async get(key) {
    return await this.redis.get(key);
  }

  async set(key, value, expiry = 3600) {
    await this.redis.set(key, value, "EX", expiry);
  }

  async del(key) {
    await this.redis.del(key);
  }
}

module.exports = new CacheService();
