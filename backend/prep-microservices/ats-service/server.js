// server.js
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const pdf = require("pdf-parse");
const natural = require("natural");
const cors = require("cors");
const axios = require("axios");
const tf = require("@tensorflow/tfjs-node");
require("dotenv").config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schemas
const ResumeSchema = new mongoose.Schema({
  content: String,
  atsScore: Number,
  suggestions: [String],
  mlScore: Number,
});

const Resume = mongoose.model("Resume", ResumeSchema);

const LinkedInProfileSchema = new mongoose.Schema({
  profileUrl: String,
  content: Object,
  suggestions: [{ section: String, suggestion: String }],
  engagementScore: Number,
});

const LinkedInProfile = mongoose.model(
  "LinkedInProfile",
  LinkedInProfileSchema
);

// Helper functions
const parseResume = async (buffer) => {
  const data = await pdf(buffer);
  return data.text;
};

const calculateATSScore = (resumeText, jobDescription) => {
  const tokenizer = new natural.WordTokenizer();
  const resumeTokens = new Set(tokenizer.tokenize(resumeText.toLowerCase()));
  const jdTokens = new Set(tokenizer.tokenize(jobDescription.toLowerCase()));
  const matchingTokens = new Set(
    [...resumeTokens].filter((x) => jdTokens.has(x))
  );
  return Math.round((matchingTokens.size / jdTokens.size) * 100);
};

const generateResumeSuggestions = (resumeText, jobDescription) => {
  const suggestions = [];
  const tokenizer = new natural.WordTokenizer();
  const resumeTokens = new Set(tokenizer.tokenize(resumeText.toLowerCase()));
  const jdTokens = new Set(tokenizer.tokenize(jobDescription.toLowerCase()));

  // Keyword optimization
  const missingKeywords = [...jdTokens].filter((x) => !resumeTokens.has(x));
  if (missingKeywords.length > 0) {
    suggestions.push(
      `Consider adding these keywords: ${missingKeywords
        .slice(0, 5)
        .join(", ")}`
    );
  }

  // Quantify achievements
  if (!resumeText.match(/\d+%|\d+\s*(dollars|usd)|\$\d+/gi)) {
    suggestions.push(
      "Try to quantify your achievements with specific metrics or percentages."
    );
  }

  // Check for proper formatting
  if (resumeText.match(/\t|\|/g)) {
    suggestions.push(
      "Avoid using tabs or vertical bars for formatting. Stick to a simple, clean layout."
    );
  }

  // Check for standard section headings
  const standardSections = [
    "work experience",
    "education",
    "skills",
    "projects",
  ];
  const missingSections = standardSections.filter(
    (section) => !resumeText.toLowerCase().includes(section)
  );
  if (missingSections.length > 0) {
    suggestions.push(
      `Consider adding these standard sections: ${missingSections.join(", ")}`
    );
  }

  // Check for chronological order
  if (!resumeText.match(/\b(19|20)\d{2}\b/g)) {
    suggestions.push(
      "Ensure your work experience is listed in reverse chronological order with clear dates."
    );
  }

  // Check for location information
  if (!resumeText.match(/\b[A-Z][a-z]+,?\s+[A-Z]{2}\b/)) {
    suggestions.push(
      "Include location information (city, state) for each job and education entry."
    );
  }

  // Check for action verbs
  const actionVerbs = [
    "achieved",
    "improved",
    "trained",
    "managed",
    "created",
    "increased",
    "decreased",
    "developed",
  ];
  const usedActionVerbs = actionVerbs.filter((verb) =>
    resumeText.toLowerCase().includes(verb)
  );
  if (usedActionVerbs.length < 3) {
    suggestions.push(
      "Use more action verbs to describe your experiences and achievements."
    );
  }

  // Check for resume length
  const wordCount = resumeText.split(/\s+/).length;
  if (wordCount > 600) {
    suggestions.push(
      "Your resume might be too long. Consider condensing it to highlight your most relevant experiences."
    );
  } else if (wordCount < 300) {
    suggestions.push(
      "Your resume might be too short. Consider adding more details about your experiences and skills."
    );
  }

  return suggestions;
};

const generateLinkedInSuggestions = (profile) => {
  const suggestions = [];

  if (!profile.profilePicture) {
    suggestions.push({
      section: "Photo",
      suggestion:
        "Add a professional profile picture to increase profile views.",
    });
  }

  if (!profile.headline || profile.headline.length < 50) {
    suggestions.push({
      section: "Headline",
      suggestion:
        "Craft a compelling headline that goes beyond your job title. Include your specialty or value proposition.",
    });
  }

  if (!profile.summary || profile.summary.length < 200) {
    suggestions.push({
      section: "Summary",
      suggestion:
        "Write a detailed summary highlighting your professional journey, key skills, and career aspirations.",
    });
  }

  if (!profile.skills || profile.skills.length < 10) {
    suggestions.push({
      section: "Skills",
      suggestion:
        "Add more relevant skills to your profile. Aim for at least 10 key skills in your industry.",
    });
  }

  if (!profile.recommendations || profile.recommendations.length < 2) {
    suggestions.push({
      section: "Recommendations",
      suggestion:
        "Request recommendations from colleagues or supervisors to add credibility to your profile.",
    });
  }

  if (!profile.projects || profile.projects.length < 2) {
    suggestions.push({
      section: "Projects",
      suggestion:
        "Showcase your work by adding relevant projects to your profile.",
    });
  }

  if (!profile.certifications || profile.certifications.length < 1) {
    suggestions.push({
      section: "Certifications",
      suggestion:
        "Add relevant certifications to demonstrate your expertise and commitment to professional development.",
    });
  }

  if (!profile.volunteerExperience) {
    suggestions.push({
      section: "Volunteer Experience",
      suggestion:
        "Consider adding volunteer experience to showcase your values and additional skills.",
    });
  }

  return suggestions;
};

// ML model for resume scoring (simplified example)
const createResumeModel = () => {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 10, inputShape: [5], activation: "relu" })
  );
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));
  model.compile({ optimizer: "adam", loss: "binaryCrossentropy" });
  return model;
};

const resumeModel = createResumeModel();

const predictResumeScore = (features) => {
  const tensorFeatures = tf.tensor2d([features]);
  const prediction = resumeModel.predict(tensorFeatures);
  return prediction.dataSync()[0];
};

// ML model for LinkedIn engagement scoring (simplified example)
const createLinkedInModel = () => {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 10, inputShape: [5], activation: "relu" })
  );
  model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));
  model.compile({ optimizer: "adam", loss: "binaryCrossentropy" });
  return model;
};

const linkedInModel = createLinkedInModel();

const predictLinkedInEngagement = (features) => {
  const tensorFeatures = tf.tensor2d([features]);
  const prediction = linkedInModel.predict(tensorFeatures);
  return prediction.dataSync()[0];
};

// Routes
app.post("/api/analyze-resume", upload.single("resume"), async (req, res) => {
  try {
    const resumeText = await parseResume(req.file.buffer);
    const jobDescription = req.body.jobDescription || "";
    const atsScore = calculateATSScore(resumeText, jobDescription);
    const suggestions = generateResumeSuggestions(resumeText, jobDescription);

    // Extract features for ML model (simplified example)
    const wordCount = resumeText.split(/\s+/).length;
    const keywordCount = jobDescription
      .split(/\s+/)
      .filter((word) =>
        resumeText.toLowerCase().includes(word.toLowerCase())
      ).length;
    const sectionCount = [
      "experience",
      "education",
      "skills",
      "projects",
    ].filter((section) => resumeText.toLowerCase().includes(section)).length;
    const hasQuantifiedAchievements = resumeText.match(
      /\d+%|\d+\s*(dollars|usd)|\$\d+/gi
    )
      ? 1
      : 0;
    const hasLocationInfo = resumeText.match(/\b[A-Z][a-z]+,?\s+[A-Z]{2}\b/)
      ? 1
      : 0;

    const mlScore = predictResumeScore([
      wordCount / 1000,
      keywordCount / 100,
      sectionCount / 4,
      hasQuantifiedAchievements,
      hasLocationInfo,
    ]);

    const resume = new Resume({
      content: resumeText,
      atsScore,
      suggestions,
      mlScore: mlScore * 100, // Convert to percentage
    });
    await resume.save();

    res.json({ atsScore, suggestions, mlScore: mlScore * 100 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/enhance-linkedin", async (req, res) => {
  try {
    const { profileUrl } = req.body;

    // Note: In a production environment, you should use LinkedIn's official API
    // This is a placeholder for the actual LinkedIn profile fetching logic
    const profileContent = await fetchLinkedInProfile(profileUrl);

    const suggestions = generateLinkedInSuggestions(profileContent);

    // Extract features for ML model (simplified example)
    const connectionCount = profileContent.connections || 0;
    const skillCount = profileContent.skills ? profileContent.skills.length : 0;
    const hasProfilePicture = profileContent.profilePicture ? 1 : 0;
    const summaryLength = profileContent.summary
      ? profileContent.summary.length
      : 0;
    const recommendationCount = profileContent.recommendations
      ? profileContent.recommendations.length
      : 0;

    const engagementScore = predictLinkedInEngagement([
      connectionCount / 500,
      skillCount / 50,
      hasProfilePicture,
      summaryLength / 1000,
      recommendationCount / 10,
    ]);

    const linkedInProfile = new LinkedInProfile({
      profileUrl,
      content: profileContent,
      suggestions,
      engagementScore: engagementScore * 100, // Convert to percentage
    });
    await linkedInProfile.save();

    res.json({ suggestions, engagementScore: engagementScore * 100 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to fetch LinkedIn profile (placeholder)
async function fetchLinkedInProfile(profileUrl) {
  // This is a placeholder. In reality, you'd make an API call to LinkedIn
  return {
    profilePicture: "https://example.com/profile.jpg",
    headline: "Software Engineer",
    summary:
      "Experienced developer with a passion for creating efficient solutions.",
    skills: ["JavaScript", "React", "Node.js"],
    recommendations: [],
    connections: 500,
    projects: [{ name: "Project 1", description: "A web app" }],
    certifications: [],
    volunteerExperience: null,
  };
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
