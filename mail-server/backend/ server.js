const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");
const Queue = require("bull");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connect to Redis
const redisClient = redis.createClient(process.env.REDIS_URL);

// Create email queue
const emailQueue = new Queue("email-queue", process.env.REDIS_URL);

// Models
const User = require("./models/User");
const Email = require("./models/Email");

// Routes
const authRoutes = require("./routes/auth");
const emailRoutes = require("./routes/email");
const userRoutes = require("./routes/user");

app.use("/auth", authRoutes);
app.use("/email", emailRoutes);
app.use("/user", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
