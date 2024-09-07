const mongoose = require("mongoose");

const TopicSchema = mongoose.Schema({
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
  subTopic: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubTopic",
    },
  ],

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Topic = mongoose.model("Topic", TopicSchema);
