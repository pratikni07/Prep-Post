const mongoose = require("mongoose");

const SubTopicSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  role: {
    type: String,
  },
  discription: {
    type: String,
    require: true,
  },
  topic: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
    },
  ],
  relatedQuestions: {
    type: Array,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const SubTopic = mongoose.model("SubTopic", SubTopicSchema);
