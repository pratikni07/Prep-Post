const Interview = require("../models/Interview");
const {
  generateQuestions,
  analyzeAnswer,
  generateFeedback,
  generatePerformanceReport,
} = require("../services/aiService");
const { textToSpeech, generateLipSync } = require("../services/mediaService");

exports.startInterview = async (data) => {
  try {
    const { jobDescription, userId } = data;
    const questions = await generateQuestions(jobDescription);
    const interview = new Interview({
      jobDescription,
      questions: questions.map((q) => ({ text: q, answer: "", score: 0 })),
      userId,
    });
    await interview.save();

    // Generate initial lip-sync video
    const introText =
      "Welcome to your mock interview. Let's begin with the first question.";
    const audioPath = await textToSpeech(introText);
    const videoPath = await generateLipSync(audioPath);

    return { interviewId: interview._id, questions, introVideo: videoPath };
  } catch (error) {
    console.error("Error starting interview:", error);
    throw error;
  }
};

exports.submitAnswer = async (data) => {
  try {
    const { interviewId, questionIndex, answer } = data;
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      throw new Error("Interview not found");
    }

    interview.questions[questionIndex].answer = answer;
    const analysis = await analyzeAnswer(
      answer,
      interview.questions[questionIndex].text
    );
    interview.questions[questionIndex].score = analysis.score;
    await interview.save();

    // Generate lip-sync video for next question or feedback
    let nextText;
    if (questionIndex < interview.questions.length - 1) {
      nextText = interview.questions[questionIndex + 1].text;
    } else {
      nextText =
        "Thank you for completing the interview. I'll now provide you with feedback.";
    }
    const audioPath = await textToSpeech(nextText);
    const videoPath = await generateLipSync(audioPath);

    return { analysis, nextVideo: videoPath };
  } catch (error) {
    console.error("Error submitting answer:", error);
    throw error;
  }
};

exports.finishInterview = async (interviewId) => {
  try {
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      throw new Error("Interview not found");
    }

    const feedback = await generateFeedback(interview);
    const performanceReport = await generatePerformanceReport(interview);

    interview.feedback = feedback;
    interview.performanceReport = performanceReport;
    await interview.save();

    // Generate final lip-sync video
    const summaryText = `Here's a summary of your performance: Your overall score is ${
      performanceReport.overallScore
    }. 
                         Your key strengths are ${performanceReport.strengths.join(
                           ", "
                         )}. 
                         Areas for improvement include ${performanceReport.areasForImprovement.join(
                           ", "
                         )}.`;
    const audioPath = await textToSpeech(summaryText);
    const videoPath = await generateLipSync(audioPath);

    return { feedback, performanceReport, summaryVideo: videoPath };
  } catch (error) {
    console.error("Error finishing interview:", error);
    throw error;
  }
};
