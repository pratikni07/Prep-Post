const Queue = require("bull");
const natural = require("natural");
const tokenizer = new natural.WordTokenizer();

const atsQueue = new Queue("ats-processing", process.env.REDIS_URL);

atsQueue.process(async (job) => {
  const { resumeContent, jobDescription } = job.data;

  // Tokenize and process resume and job description
  const resumeTokens = tokenizer.tokenize(resumeContent.toLowerCase());
  const jobTokens = tokenizer.tokenize(jobDescription.toLowerCase());

  // Calculate TF-IDF scores
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(resumeTokens);
  tfidf.addDocument(jobTokens);

  // Calculate similarity score
  let score = 0;
  jobTokens.forEach((token) => {
    score += tfidf.tfidf(token, 0);
  });

  // Normalize score
  score = Math.min(100, Math.round((score / jobTokens.length) * 100));

  return score;
});
