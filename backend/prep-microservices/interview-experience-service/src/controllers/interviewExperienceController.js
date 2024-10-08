const InterviewExperience = require("../models/interviewExperienceModel");
const asyncHandler = require("express-async-handler");

exports.getInterviewExperiences = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, company, role } = req.query;
  const query = {};

  if (company) query.company = company;
  if (role) query.role = { $regex: role, $options: "i" };

  const experiences = await InterviewExperience.find(query)
    .populate("user", "name")
    .populate("company", "name")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ createdAt: -1 })
    .exec();

  const count = await InterviewExperience.countDocuments(query);

  res.json({
    experiences,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
});

exports.getInterviewExperience = asyncHandler(async (req, res) => {
  const experience = await InterviewExperience.findById(req.params.id)
    .populate("user", "name")
    .populate("company", "name")
    .populate("comments.user", "name")
    .populate("relatedTopics", "name")
    .populate("relatedQuestions", "title");

  if (experience) {
    res.json(experience);
  } else {
    res.status(404);
    throw new Error("Interview experience not found");
  }
});

exports.createInterviewExperience = asyncHandler(async (req, res) => {
  const {
    company,
    role,
    content,
    relatedRoles,
    relatedTopics,
    relatedQuestions,
  } = req.body;

  const experience = await InterviewExperience.create({
    user: req.user._id,
    company,
    role,
    content,
    relatedRoles,
    relatedTopics,
    relatedQuestions,
  });

  res.status(201).json(experience);
});

exports.updateInterviewExperience = asyncHandler(async (req, res) => {
  const { role, content, relatedRoles, relatedTopics, relatedQuestions } =
    req.body;

  const experience = await InterviewExperience.findById(req.params.id);

  if (experience) {
    if (
      experience.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res.status(403);
      throw new Error("User not authorized to update this experience");
    }

    experience.role = role || experience.role;
    experience.content = content || experience.content;
    experience.relatedRoles = relatedRoles || experience.relatedRoles;
    experience.relatedTopics = relatedTopics || experience.relatedTopics;
    experience.relatedQuestions =
      relatedQuestions || experience.relatedQuestions;
    experience.updatedAt = Date.now();

    const updatedExperience = await experience.save();
    res.json(updatedExperience);
  } else {
    res.status(404);
    throw new Error("Interview experience not found");
  }
});

exports.deleteInterviewExperience = asyncHandler(async (req, res) => {
  const experience = await InterviewExperience.findById(req.params.id);

  if (experience) {
    if (
      experience.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res.status(403);
      throw new Error("User not authorized to delete this experience");
    }

    await experience.remove();
    res.json({ message: "Interview experience removed" });
  } else {
    res.status(404);
    throw new Error("Interview experience not found");
  }
});

exports.addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const experience = await InterviewExperience.findById(req.params.id);

  if (experience) {
    const comment = {
      user: req.user._id,
      content,
    };

    experience.comments.push(comment);
    await experience.save();

    res.status(201).json({ message: "Comment added" });
  } else {
    res.status(404);
    throw new Error("Interview experience not found");
  }
});

exports.likeInterviewExperience = asyncHandler(async (req, res) => {
  const experience = await InterviewExperience.findById(req.params.id);

  if (experience) {
    if (experience.likes.includes(req.user._id)) {
      experience.likes = experience.likes.filter(
        (like) => like.toString() !== req.user._id.toString()
      );
    } else {
      experience.likes.push(req.user._id);
    }

    await experience.save();
    res.json({ likes: experience.likes.length });
  } else {
    res.status(404);
    throw new Error("Interview experience not found");
  }
});
