const Notification = require("../models/notification");
const emailService = require("./emailService");
const smsService = require("./smsService");
const pushNotificationService = require("./pushNotificationService");
const logger = require("../utils/logger");
const { redisClient } = require("../config/redis");

exports.sendNotification = async (userId, type, message) => {
  try {
    const notification = new Notification({ userId, type, message });
    await notification.save();

    let result;
    switch (type) {
      case "email":
        result = await emailService.sendEmail(userId, message);
        break;
      case "sms":
        result = await smsService.sendSMS(userId, message);
        break;
      case "push":
        result = await pushNotificationService.sendPushNotification(
          userId,
          message
        );
        break;
      default:
        throw new Error("Invalid notification type");
    }

    notification.status = "sent";
    await notification.save();

    // Invalidate cache
    await redisClient.del(`notifications:${userId}`);

    return result;
  } catch (error) {
    logger.error("Error in sendNotification service", error);
    throw error;
  }
};

exports.getUserNotifications = async (userId) => {
  try {
    // Check cache first
    const cachedNotifications = await redisClient.get(
      `notifications:${userId}`
    );
    if (cachedNotifications) {
      return JSON.parse(cachedNotifications);
    }

    // If not in cache, fetch from database
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    // Cache the result
    await redisClient.set(
      `notifications:${userId}`,
      JSON.stringify(notifications),
      "EX",
      3600
    ); // Cache for 1 hour

    return notifications;
  } catch (error) {
    logger.error("Error in getUserNotifications service", error);
    throw error;
  }
};
