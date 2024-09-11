const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateQuestions = async (jobDescription) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an AI interview assistant. Generate 10 relevant interview questions based on the job description.",
      },
      { role: "user", content: jobDescription },
    ],
  });
  return response.choices[0].message.content
    .split("\n")
    .filter((q) => q.trim() !== "");
};

exports.analyzeAnswer = async (answer, question) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an AI interview analyzer. Provide feedback on the answer to the given question and score it from 0 to 10.",
      },
      { role: "user", content: `Question: ${question}\nAnswer: ${answer}` },
    ],
  });
  const analysis = response.choices[0].message.content;
  const score = parseInt(analysis.match(/Score: (\d+)/)[1]);
  return { analysis, score };
};

exports.generateFeedback = async (interview) => {
  const interviewSummary = interview.questions
    .map((q) => `Q: ${q.text}\nA: ${q.answer}\nScore: ${q.score}`)
    .join("\n\n");
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an AI interview feedback generator. Provide comprehensive feedback for the entire interview.",
      },
      {
        role: "user",
        content: `Job Description: ${interview.jobDescription}\n\nInterview Summary:\n${interviewSummary}`,
      },
    ],
  });
  return response.choices[0].message.content;
};

exports.generatePerformanceReport = async (interview) => {
  const interviewSummary = interview.questions
    .map((q) => `Q: ${q.text}\nA: ${q.answer}\nScore: ${q.score}`)
    .join("\n\n");
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an AI performance analyzer. Generate a performance report including overall score, strengths, areas for improvement, and recommendations.",
      },
      {
        role: "user",
        content: `Job Description: ${interview.jobDescription}\n\nInterview Summary:\n${interviewSummary}`,
      },
    ],
  });
  const report = JSON.parse(response.choices[0].message.content);
  return {
    overallScore: report.overallScore,
    strengths: report.strengths,
    areasForImprovement: report.areasForImprovement,
    recommendations: report.recommendations,
  };
};
