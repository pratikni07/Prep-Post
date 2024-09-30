// preparation-service/routes/preparation.js
const express = require("express");
const router = express.Router();
const Topic = require("../models/Topic");
const Company = require("../models/Company");

router.get("/topics", async (req, res) => {
  try {
    const topics = await Topic.find().populate("subtopics");
    res.json(topics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/companies", async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/company/:id", async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ msg: "Company not found" });
    }
    res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
