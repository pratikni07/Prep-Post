const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema({
  subject: String,
  body: String,
  sentTo: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Email", emailSchema);
