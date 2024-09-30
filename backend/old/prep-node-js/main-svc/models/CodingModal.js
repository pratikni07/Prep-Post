const mongoose = require("mongoose");

const CodingModal = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  topic: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
    },
  ],
  subTopic: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubTopic",
    },
  ],
  company: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  ],
  code: {
    type: String,
    required: true,
  },
  explaination: {
    type: String,
    required: true,
  },
  reportedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  solvedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  publishedBy: {
    type: String,
    required: true,
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Coding = mongoose.model("Coding", CodingModal);
