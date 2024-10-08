const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
});

const recruitmentProcessSchema = new mongoose.Schema({
  stage: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String },
});

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  backgroundImage: {
    type: String,
  },
  locations: [locationSchema],
  paperPattern: {
    type: String,
  },
  recruitmentProcess: [recruitmentProcessSchema],
  industries: [
    {
      type: String,
    },
  ],
  website: {
    type: String,
  },
  foundedYear: {
    type: Number,
  },
  employeeCount: {
    type: String,
  },
  topics: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
