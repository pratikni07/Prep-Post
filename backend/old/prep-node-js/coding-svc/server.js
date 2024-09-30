const express = require("express");
const mongoose = require("mongoose");
const Redis = require("ioredis");
const { Kafka } = require("kafkajs");
const socketIO = require("socket.io");
const http = require("http");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const compression = require("compression");
const codingRoutes = require("./routes/CodingRoutes");

// Express app setup
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

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

// Redis setup
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

// Kafka setup
const kafka = new Kafka({
  clientId: "coding-platform",
  brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "coding-group" });

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/coding", codingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Kafka consumer setup
const runKafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "new-problem" });
  await consumer.subscribe({ topic: "problem-solved" });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const messageValue = JSON.parse(message.value.toString());

      switch (topic) {
        case "new-problem":
          console.log("New problem created:", messageValue);
          io.emit("new-problem", messageValue);
          break;
        case "problem-solved":
          console.log("Problem solved:", messageValue);
          io.emit("problem-solved", messageValue);
          break;
        default:
          console.log("Unknown topic:", topic);
      }
    },
  });
};

// Start Kafka consumer
runKafkaConsumer().catch(console.error);

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });

  await consumer.disconnect();
  await producer.disconnect();
  await mongoose.connection.close();
  await redis.quit();

  process.exit(0);
});

module.exports = { app, server, io, redis, producer };
