const twilio = require("twilio");
const config = require("../config");
const logger = require("../utils/logger");

const client = twilio(config.smsApiKey, config.smsApiSecret);

exports.sendSMS = async (userId, message) => {
  try {
    // In a real application, you would fetch the user's phone number from the database
    const userPhone = `+1234567890`;

    const result = await client.messages.create({
      body: message,
      from: config.smsFromNumber,
      to: userPhone,
    });

    logger.info(`SMS sent: ${result.sid}`);
    return result;
  } catch (error) {
    logger.error("Error sending SMS", error);
    throw error;
  }
};
