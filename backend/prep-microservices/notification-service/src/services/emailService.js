const nodemailer = require("nodemailer");
const config = require("../config");
const logger = require("../utils/logger");

const transporter = nodemailer.createTransport({
  service: config.emailService,
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

exports.sendEmail = async (userId, message) => {
  try {
    // In a real application, you would fetch the user's email from the database
    const userEmail = `${userId}@example.com`;

    const mailOptions = {
      from: config.emailUser,
      to: userEmail,
      subject: "Notification from Prep&Post",
      text: message,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error("Error sending email", error);
    throw error;
  }
};
