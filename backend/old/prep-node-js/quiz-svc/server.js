// app.js or server.js
const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Connect to Redis
const redisClient = redis.createClient(process.env.REDIS_URL);
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

// Middleware
app.use(express.json());

// Use routes
app.use("/api", routes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
