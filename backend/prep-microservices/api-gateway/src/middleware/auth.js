const jwt = require("jsonwebtoken");
const config = require("../config");
const { formatErrorResponse } = require("../utils/responseFormatter");
const authService = require("../services/authService");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await authService.validateUser(decoded.id, token);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json(formatErrorResponse("Please authenticate", 401));
  }
};
