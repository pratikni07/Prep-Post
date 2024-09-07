const mongoose = require("mongoose");

const QuizSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  ],
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
  solvedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  visibilty: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    enum: ["public", "private"],
  },
  crearedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      options: [
        {
          option: {
            type: String,
            required: true,
          },
          isCorrect: {
            type: Boolean,
            required: true,
          },
        },
      ],
    },
  ],

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Quiz = mongoose.model("Quiz", QuizSchema);
