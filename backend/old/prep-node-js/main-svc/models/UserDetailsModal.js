const mongoose = require("mongoose");

const UserDetailSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  quiz: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
  ],
  resume: {
    type: String,
  },

  education: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Education",
    },
  ],
  skills: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
    },
  ],
  experience: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experience",
    },
  ],
  certifications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Certification",
    },
  ],
  languages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Language",
    },
  ],
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
  achievements: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Achievement",
    },
  ],
  publications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publication",
    },
  ],
  score: {
    type: Number,
  },
  posts: [
    {
      type: String,
    },
  ],
  connections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  followings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  blockedUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  subscriber: {
    type: Boolean,
    default: false,
  },
});

const UserDetail = mongoose.model("User", UserDetailSchema);
