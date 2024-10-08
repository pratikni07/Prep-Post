const admin = require("firebase-admin");
const config = require("../config");
const logger = require("../utils/logger");

admin.initializeApp({
  credential: admin.credential.cert(config.fcmServerKey),
});

exports.sendPushNotification = async (userId, message) => {
  try {
    // In a real application, you would fetch the user's FCM token from the database
    const userFcmToken = "user_fcm_token";

    const payload = {
      notification: {
        title: "Notification from Prep&Post",
        body: message,
      },
    };

    const result = await admin.messaging().sendToDevice(userFcmToken, payload);
    logger.info(`Push notification sent: ${result.results[0].messageId}`);
    return result;
  } catch (error) {
    logger.error("Error sending push notification", error);
    throw error;
  }
};
