const Subtopic = require("../models/subtopicModel");
const Topic = require("../models/topicModel");
const asyncHandler = require("express-async-handler");

exports.getSubtopics = asyncHandler(async (req, res) => {
  const subtopics = await Subtopic.find().populate("topic", "name");
  res.json(subtopics);
});

exports.getSubtopic = asyncHandler(async (req, res) => {
  const subtopic = await Subtopic.findById(req.params.id).populate("topic");
  if (subtopic) {
    res.json(subtopic);
  } else {
    res.status(404);
    throw new Error("Subtopic not found");
  }
});

exports.createSubtopic = asyncHandler(async (req, res) => {
  const { name, description, topicId } = req.body;

  const topic = await Topic.findById(topicId);
  if (!topic) {
    res.status(404);
    throw new Error("Topic not found");
  }

  const subtopic = await Subtopic.create({ name, description, topic: topicId });

  topic.subtopics.push(subtopic._id);
  await topic.save();

  res.status(201).json(subtopic);
});

exports.updateSubtopic = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const subtopic = await Subtopic.findById(req.params.id);

  if (subtopic) {
    subtopic.name = name || subtopic.name;
    subtopic.description = description || subtopic.description;
    subtopic.updatedAt = Date.now();

    const updatedSubtopic = await subtopic.save();
    res.json(updatedSubtopic);
  } else {
    res.status(404);
    throw new Error("Subtopic not found");
  }
});

exports.deleteSubtopic = asyncHandler(async (req, res) => {
  const subtopic = await Subtopic.findById(req.params.id);

  if (subtopic) {
    await Topic.findByIdAndUpdate(subtopic.topic, {
      $pull: { subtopics: subtopic._id },
    });
    await subtopic.remove();
    res.json({ message: "Subtopic removed" });
  } else {
    res.status(404);
    throw new Error("Subtopic not found");
  }
});
