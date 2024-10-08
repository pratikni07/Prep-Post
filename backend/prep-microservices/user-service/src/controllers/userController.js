const userService = require("../services/userService");
const {
  formatSuccessResponse,
  formatErrorResponse,
} = require("../utils/responseFormatter");
const logger = require("../utils/logger");

exports.register = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    const token = user.generateAuthToken();
    res
      .status(201)
      .json(
        formatSuccessResponse({ user, token }, "User registered successfully")
      );
  } catch (error) {
    logger.error("Error in user registration:", error);
    res.status(400).json(formatErrorResponse(error.message));
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await userService.loginUser(email, password);
    res.json(formatSuccessResponse({ user, token }, "Login successful"));
  } catch (error) {
    logger.error("Error in user login:", error);
    res.status(401).json(formatErrorResponse(error.message));
  }
};

exports.getProfile = async (req, res) => {
  res.json(formatSuccessResponse(req.user));
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await userService.updateUser(req.user._id, req.body);
    res.json(
      formatSuccessResponse(updatedUser, "Profile updated successfully")
    );
  } catch (error) {
    logger.error("Error in updating user profile:", error);
    res.status(400).json(formatErrorResponse(error.message));
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.user._id);
    res.json(formatSuccessResponse(null, "User deleted successfully"));
  } catch (error) {
    logger.error("Error in deleting user:", error);
    res.status(500).json(formatErrorResponse(error.message));
  }
};

exports.validateUser = async (req, res) => {
  res.json(formatSuccessResponse(req.user));
};
