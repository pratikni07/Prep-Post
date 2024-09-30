// preparation-service/models/Company.js
const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  logo: String,
  backgroundImage: String,
  locations: [String],
  paperPattern: String,
  recruitmentProcess: String,
});

module.exports = mongoose.model("Company", CompanySchema);
