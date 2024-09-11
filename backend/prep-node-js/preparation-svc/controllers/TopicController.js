// controllers/topicController.js
const Topic = require("../models/Topic");

exports.createTopic = async (req, res) => {
  try {
    const { title, description, image } = req.body;
    const topic = new Topic({ title, description, image });
    await topic.save();
    res.status(201).json({ success: true, data: topic });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getTopics = async (req, res) => {
  try {
    const topics = await Topic.find().populate("subTopic");
    res.status(200).json({ success: true, data: topics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id).populate("subTopic");
    if (!topic) {
      return res.status(404).json({ success: false, error: "Topic not found" });
    }
    res.status(200).json({ success: true, data: topic });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!topic) {
      return res.status(404).json({ success: false, error: "Topic not found" });
    }
    res.status(200).json({ success: true, data: topic });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const topic = await Topic.findByIdAndDelete(req.params.id);
    if (!topic) {
      return res.status(404).json({ success: false, error: "Topic not found" });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
