module.exports = {
  mongoURI:
    process.env.MONGO_URI || "mongodb://localhost:27017/prep_post_analytics",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  kafkaBroker: process.env.KAFKA_BROKER || "localhost:9092",
  // Add other configuration variables as needed
};
