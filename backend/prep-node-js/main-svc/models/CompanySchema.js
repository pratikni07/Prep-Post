const mongoose = require("mongoose");

const SubTopicSchema = mongoose.Schema({
  name: {
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
  paperPattern: {
    type: String,
  },
  topicId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
    },
  ],
});

const SubTopic = mongoose.model("SubTopic", SubTopicSchema);
