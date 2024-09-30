const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const interviewRoutes = require("./routes/interviewRoutes");
app.use("/api/interviews", interviewRoutes);

// WebSocket connection
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("startInterview", async (data) => {
    // Handle interview start
    const interviewController = require("./controllers/interviewController");
    const result = await interviewController.startInterview(data);
    socket.emit("interviewStarted", result);
  });

  socket.on("submitAnswer", async (data) => {
    // Handle answer submission
    const interviewController = require("./controllers/interviewController");
    const result = await interviewController.submitAnswer(data);
    socket.emit("answerProcessed", result);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
