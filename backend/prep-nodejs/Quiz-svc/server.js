// quiz-service/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use("/api/quiz", require("./routes/quiz"));

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => console.log(`Quiz service running on port ${PORT}`));
