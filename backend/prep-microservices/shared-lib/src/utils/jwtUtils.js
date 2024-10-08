const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpirationInterval } = require("./constants");

const jwtUtils = {
  generateToken: (userId) => {
    return jwt.sign({ id: userId }, jwtSecret, {
      expiresIn: jwtExpirationInterval,
    });
  },

  verifyToken: (token) => {
    return jwt.verify(token, jwtSecret);
  },
};

module.exports = jwtUtils;
