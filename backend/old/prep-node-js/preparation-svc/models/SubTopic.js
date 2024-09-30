const mongoose = require("mongoose");

const SubTopicSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  company: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  ],
  coding: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coding",
    },
  ],
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
  },
  quiz: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
  ],

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const SubTopic = mongoose.model("SubTopic", SubTopicSchema);
