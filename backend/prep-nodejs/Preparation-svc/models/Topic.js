// preparation-service/models/Topic.js
const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subtopics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subtopic" }],
});

module.exports = mongoose.model("Topic", TopicSchema);
