// notification-service/routes/notifications.js
const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/mark-read", async (req, res) => {
  try {
    const { notificationId } = req.body;
    await Notification.findByIdAndUpdate(notificationId, { read: true });
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

async function createNotification(data) {
  try {
    const notification = new Notification(data);
    await notification.save();
  } catch (err) {
    console.error("Error creating notification:", err);
  }
}

module.exports = router;
