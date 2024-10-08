const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { errorHandler } = require("./middleware/errorHandler");
const searchRoutes = require("./routes/searchRoutes");
const { connectKafka } = require("./config/kafka");
const { connectElasticsearch } = require("./config/elasticsearch");
const logger = require("./utils/logger");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use("/api/search", searchRoutes);

// Error handling
app.use(errorHandler);

// Kafka and Elasticsearch connections
connectKafka();
connectElasticsearch();

module.exports = app;
