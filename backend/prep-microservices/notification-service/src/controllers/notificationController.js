const notificationService = require("../services/notificationService");
const logger = require("../utils/logger");

exports.sendNotification = async (req, res, next) => {
  try {
    const { userId, type, message } = req.body;
    const result = await notificationService.sendNotification(
      userId,
      type,
      message
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    logger.error("Error in sendNotification controller", error);
    next(error);
  }
};

exports.getUserNotifications = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const notifications = await notificationService.getUserNotifications(
      userId
    );
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    logger.error("Error in getUserNotifications controller", error);
    next(error);
  }
};
