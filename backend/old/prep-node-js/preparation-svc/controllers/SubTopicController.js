// controllers/subTopicController.js
const SubTopic = require("../models/SubTopic");
const Topic = require("../models/Topic");

exports.createSubTopic = async (req, res) => {
  try {
    const { title, description, image, topic } = req.body;
    const subTopic = new SubTopic({ title, description, image, topic });
    await subTopic.save();

    // Add subTopic to the parent Topic
    await Topic.findByIdAndUpdate(topic, { $push: { subTopic: subTopic._id } });

    res.status(201).json({ success: true, data: subTopic });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getSubTopics = async (req, res) => {
  try {
    const subTopics = await SubTopic.find()
      .populate("topic")
      .populate("company")
      .populate("coding")
      .populate("quiz");
    res.status(200).json({ success: true, data: subTopics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSubTopic = async (req, res) => {
  try {
    const subTopic = await SubTopic.findById(req.params.id)
      .populate("topic")
      .populate("company")
      .populate("coding")
      .populate("quiz");
    if (!subTopic) {
      return res
        .status(404)
        .json({ success: false, error: "SubTopic not found" });
    }
    res.status(200).json({ success: true, data: subTopic });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateSubTopic = async (req, res) => {
  try {
    const subTopic = await SubTopic.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!subTopic) {
      return res
        .status(404)
        .json({ success: false, error: "SubTopic not found" });
    }
    res.status(200).json({ success: true, data: subTopic });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.deleteSubTopic = async (req, res) => {
  try {
    const subTopic = await SubTopic.findById(req.params.id);
    if (!subTopic) {
      return res
        .status(404)
        .json({ success: false, error: "SubTopic not found" });
    }

    // Remove subTopic from the parent Topic
    await Topic.findByIdAndUpdate(subTopic.topic, {
      $pull: { subTopic: subTopic._id },
    });

    await subTopic.remove();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
