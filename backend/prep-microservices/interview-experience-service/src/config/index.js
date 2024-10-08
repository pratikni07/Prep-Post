module.exports = {
  mongoURI:
    process.env.MONGO_URI || "mongodb://localhost:27017/prep_post_interview",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
  // Add other configuration variables as needed
};
