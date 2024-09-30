const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");
const winston = require("winston");
const expressWinston = require("express-winston");
const Redis = require("ioredis");
const CircuitBreaker = require("opossum");

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Logging
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "main-service" },
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

// Circuit Breaker setup
const breakerOptions = {
  timeout: 5000, // If our function takes longer than 5 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
};

// Routes
app.use("/api/auth", require("./routes/auth"));

// Proxy middleware setup with circuit breaker
const services = [
  { path: "/api/ats", target: "http://ats-service:3001" },
  { path: "/api/coding", target: "http://coding-service:3002" },
  { path: "/api/interview", target: "http://interview-service:3003" },
  { path: "/api/notification", target: "http://notification-service:3004" },
  { path: "/api/preparation", target: "http://preparation-service:3005" },
  { path: "/api/quiz", target: "http://quiz-service:3006" },
];

services.forEach((service) => {
  const breaker = new CircuitBreaker(
    createProxyMiddleware({
      target: service.target,
      changeOrigin: true,
      onError: (err, req, res) => {
        logger.error(`Proxy error: ${err.message}`);
        res.status(500).json({ error: "Service unavailable" });
      },
    }),
    breakerOptions
  );

  app.use(service.path, (req, res, next) => {
    breaker.fire(req, res, next).catch((err) => {
      logger.error(`Circuit breaker error: ${err.message}`);
      res.status(503).json({ error: "Service temporarily unavailable" });
    });
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`Main service running on port ${PORT}`));
