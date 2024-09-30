const natural = require("natural");
const stopwords = require("stopwords").english;

const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

function preprocessText(text) {
  const tokens = tokenizer.tokenize(text.toLowerCase());
  return tokens
    .filter((token) => !stopwords.includes(token))
    .map((token) => stemmer.stem(token));
}

function calculateTfIdf(doc, docs) {
  const tfidf = new natural.TfIdf();
  docs.forEach((d) => tfidf.addDocument(d));

  return doc.map((term) => {
    return tfidf.tfidf(term, 0);
  });
}

exports.calculateAtsScore = (resumeText, jobDescription) => {
  const resumeTokens = preprocessText(resumeText);
  const jobTokens = preprocessText(jobDescription);

  const resumeTfIdf = calculateTfIdf(resumeTokens, [resumeTokens, jobTokens]);
  const jobTfIdf = calculateTfIdf(jobTokens, [resumeTokens, jobTokens]);

  const dotProduct = resumeTfIdf.reduce(
    (sum, val, i) => sum + val * jobTfIdf[i],
    0
  );
  const resumeMagnitude = Math.sqrt(
    resumeTfIdf.reduce((sum, val) => sum + val * val, 0)
  );
  const jobMagnitude = Math.sqrt(
    jobTfIdf.reduce((sum, val) => sum + val * val, 0)
  );

  const cosineSimilarity = dotProduct / (resumeMagnitude * jobMagnitude);
  return Math.round(cosineSimilarity * 100);
};

exports.generateSuggestions = (resumeText, jobDescription) => {
  const resumeTokens = new Set(preprocessText(resumeText));
  const jobTokens = preprocessText(jobDescription);

  const missingKeywords = jobTokens.filter((token) => !resumeTokens.has(token));

  const suggestions = [];

  if (missingKeywords.length > 0) {
    suggestions.push(
      `Consider adding these keywords to your resume: ${missingKeywords
        .slice(0, 5)
        .join(", ")}`
    );
  }

  const resumeSentences = resumeText.split(/[.!?]+/);
  if (resumeSentences.length > 20) {
    suggestions.push(
      "Your resume might be too long. Consider condensing it to improve readability."
    );
  } else if (resumeSentences.length < 5) {
    suggestions.push(
      "Your resume might be too short. Consider adding more details about your experience and skills."
    );
  }

  return suggestions;
};
