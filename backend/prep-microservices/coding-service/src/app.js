const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { errorHandler } = require("./middleware/errorHandler");
const routes = require("./routes");
const config = require("./config");
const logger = require("./utils/logger");
const { initializeKafka } = require("./services/kafkaService");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use("/api", routes);

// Error handling
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("MongoDB connection error:", { error: err }));

// Initialize Kafka
initializeKafka().catch((err) =>
  logger.error("Kafka initialization error:", { error: err })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

const port = process.env.PORT || 3003;
app.listen(port, () => {
  logger.info(`Coding service listening on port ${port}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received. Closing HTTP server.");
  app.close(() => {
    logger.info("HTTP server closed.");
    mongoose.connection.close(false, () => {
      logger.info("MongoDB connection closed.");
      process.exit(0);
    });
  });
});

module.exports = app;
