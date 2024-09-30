const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  subscriber: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  college: String,
  branch: String,
  yearOfPassing: Number,
  companiesPreferred: [String],
  experience: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Experience",
    },
  ],
  linkedinId: String,
  visibility: {
    type: Boolean,
    default: true,
  },
  networks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
  views: {
    type: Number,
    default: 0,
  },
  education: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Education",
    },
  ],
  skills: [String],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

UserSchema.index({ email: 1 });
UserSchema.index({ name: 1 });

module.exports = mongoose.model("User", UserSchema);
