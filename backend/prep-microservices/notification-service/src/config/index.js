require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI,
  kafkaBrokers: process.env.KAFKA_BROKERS.split(","),
  kafkaClientId: process.env.KAFKA_CLIENT_ID,
  kafkaGroupId: process.env.KAFKA_GROUP_ID,
  redisUrl: process.env.REDIS_URL,
  emailService: process.env.EMAIL_SERVICE,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  smsApiKey: process.env.SMS_API_KEY,
  fcmServerKey: process.env.FCM_SERVER_KEY,
};
