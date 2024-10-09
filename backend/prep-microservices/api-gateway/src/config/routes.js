module.exports = {
  "/api/users": {
    target: "http://user-service:3001",
    changeOrigin: true,
    pathRewrite: {
      "^/api/users": "/users",
    },
  },
  "/api/quizzes": {
    target: "http://quiz-service:3002",
    changeOrigin: true,
    pathRewrite: {
      "^/api/quizzes": "/quizzes",
    },
  },
  "/api/coding": {
    target: "http://coding-service:3003",
    changeOrigin: true,
    pathRewrite: {
      "^/api/coding": "/coding",
    },
  },
  // "/api/programming": {
  //   target: "http://programming-service:3004",
  //   changeOrigin: true,
  //   pathRewrite: {
  //     "^/api/programming": "/programming",
  //   },
  // },
  "/api/companies": {
    target: "http://company-service:3005",
    changeOrigin: true,
    pathRewrite: {
      "^/api/companies": "/companies",
    },
  },
  "/api/interview-experiences": {
    target: "http://interview-experience-service:3006",
    changeOrigin: true,
    pathRewrite: {
      "^/api/interview-experiences": "/experiences",
    },
  },
};
