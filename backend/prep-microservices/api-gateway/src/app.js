const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const { createProxyMiddleware } = require("http-proxy-middleware");

const config = require("./config");
const routes = require("./config/routes");
const rateLimiter = require("./middleware/rateLimiter");
const errorHandler = require("./middleware/errorHandler");
const auth = require("./middleware/auth");
const logger = require("./utils/logger");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(rateLimiter);

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Setup proxy routes
Object.keys(routes).forEach((route) => {
  app.use(route, auth, createProxyMiddleware(routes[route]));
});

// Error handling
app.use(errorHandler);

const PORT = config.port || 3000;
app.listen(PORT, () => {
  logger.info(`API Gateway running on port ${PORT}`);
});

module.exports = app;
