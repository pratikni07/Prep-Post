// coding-service/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const winston = require("winston");
const expressWinston = require("express-winston");
const Redis = require("ioredis");
const Queue = require("bull");

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Logging
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "coding-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
  })
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("MongoDB connection error:", err));

// Redis setup
const redis = new Redis(process.env.REDIS_URL);

// Queue setup
const codeExecutionQueue = new Queue("code-execution", process.env.REDIS_URL);

// Routes
app.use("/api/coding", require("./routes/coding"));

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => logger.info(`Coding service running on port ${PORT}`));
