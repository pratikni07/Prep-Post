// preparation-service/server.js
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
app.use("/api/preparation", require("./routes/preparation"));

const PORT = process.env.PORT || 3005;
app.listen(PORT, () =>
  console.log(`Preparation service running on port ${PORT}`)
);
