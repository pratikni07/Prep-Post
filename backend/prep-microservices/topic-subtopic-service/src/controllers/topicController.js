const Topic = require("../models/topicModel");
const asyncHandler = require("express-async-handler");

exports.getTopics = asyncHandler(async (req, res) => {
  const topics = await Topic.find().populate("subtopics", "name");
  res.json(topics);
});

exports.getTopic = asyncHandler(async (req, res) => {
  const topic = await Topic.findById(req.params.id).populate("subtopics");
  if (topic) {
    res.json(topic);
  } else {
    res.status(404);
    throw new Error("Topic not found");
  }
});

exports.createTopic = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const topic = await Topic.create({ name, description });
  res.status(201).json(topic);
});

exports.updateTopic = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const topic = await Topic.findById(req.params.id);

  if (topic) {
    topic.name = name || topic.name;
    topic.description = description || topic.description;
    topic.updatedAt = Date.now();

    const updatedTopic = await topic.save();
    res.json(updatedTopic);
  } else {
    res.status(404);
    throw new Error("Topic not found");
  }
});

exports.deleteTopic = asyncHandler(async (req, res) => {
  const topic = await Topic.findById(req.params.id);

  if (topic) {
    await topic.remove();
    res.json({ message: "Topic removed" });
  } else {
    res.status(404);
    throw new Error("Topic not found");
  }
});
