const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config");
const { formatErrorResponse } = require("../utils/responseFormatter");
const cacheService = require("../services/cacheService");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, config.jwtSecret);

    let user = await cacheService.get(`user:${decoded.id}`);

    if (!user) {
      user = await User.findOne({ _id: decoded.id });
      if (user) {
        await cacheService.set(`user:${decoded.id}`, JSON.stringify(user));
      }
    } else {
      user = JSON.parse(user);
    }

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
