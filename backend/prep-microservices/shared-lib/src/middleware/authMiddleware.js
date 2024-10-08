const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const { jwtSecret } = require("../utils/constants");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new ApiError(401, "No token provided"));
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return next(new ApiError(401, "Token error"));
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return next(new ApiError(401, "Token malformatted"));
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return next(new ApiError(401, "Token invalid"));
    }

    req.userId = decoded.id;
    return next();
  });
};

module.exports = authMiddleware;
