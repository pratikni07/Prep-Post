const express = require("express");
const {
  sendNotification,
  getUserNotifications,
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/send", sendNotification);
router.get("/user/:userId", getUserNotifications);

module.exports = router;
