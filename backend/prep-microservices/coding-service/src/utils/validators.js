const Joi = require("joi");

exports.validateProblem = (problem) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    difficulty: Joi.string().valid("Easy", "Medium", "Hard").required(),
    topic: Joi.string().required(),
    subtopic: Joi.string(),
    sampleTestCases: Joi.array()
      .items(
        Joi.object({
          input: Joi.string().required(),
          expectedOutput: Joi.string().required(),
        })
      )
      .min(1)
      .required(),
    testCases: Joi.array()
      .items(
        Joi.object({
          input: Joi.string().required(),
          expectedOutput: Joi.string().required(),
        })
      )
      .min(1)
      .required(),
    solutionTemplate: Joi.object({
      cpp: Joi.string(),
      java: Joi.string(),
      python: Joi.string(),
      javascript: Joi.string(),
    }),
  });

  return schema.validate(problem);
};

exports.validateSubmission = (submission) => {
  const schema = Joi.object({
    problemId: Joi.string().required(),
    language: Joi.string()
      .valid("cpp", "java", "python", "javascript")
      .required(),
    code: Joi.string().required(),
  });

  return schema.validate(submission);
};
