const axios = require("axios");
const Redis = require("ioredis");
const config = require("../config");

const redisClient = new Redis(config.redisUrl);

class AuthService {
  async validateUser(userId, token) {
    const cacheKey = `user:${userId}`;

    // Try to get user from cache
    let user = await redisClient.get(cacheKey);

    if (user) {
      return JSON.parse(user);
    }

    // If not in cache, fetch from user service
    try {
      const response = await axios.get(
        `http://user-service:3001/users/${userId}/validate`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      user = response.data;

      // Cache user for 15 minutes
      await redisClient.set(cacheKey, JSON.stringify(user), "EX", 900);

      return user;
    } catch (error) {
      console.error("Error validating user:", error.message);
      return null;
    }
  }
}

module.exports = new AuthService();
