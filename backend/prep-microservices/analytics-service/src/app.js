// File: analytics-service/src/app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { createClient } = require("redis");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const analyticsRoutes = require("./routes/analyticsRoutes");
const config = require("./config");
const { setupKafkaConsumer } = require("./services/kafkaConsumer");

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use("/api/analytics", analyticsRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Database connection
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Redis connection
const redisClient = createClient({
  url: config.redisUrl,
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect().then(() => console.log("Redis connected"));

global.redisClient = redisClient;

// Start Kafka consumer
setupKafkaConsumer();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
