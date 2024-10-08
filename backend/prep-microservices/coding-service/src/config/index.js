module.exports = {
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/coding_service",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  kafkaBrokers: process.env.KAFKA_BROKERS
    ? process.env.KAFKA_BROKERS.split(",")
    : ["localhost:9092"],
};
