const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { errorHandler } = require("./middleware/errorHandler");
const notificationRoutes = require("./routes/notificationRoutes");
const { connectKafka } = require("./config/kafka");
const { connectRedis } = require("./config/redis");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api/notifications", notificationRoutes);

// Error handling
app.use(errorHandler);

// Kafka and Redis connections
connectKafka();
connectRedis();

module.exports = app;
