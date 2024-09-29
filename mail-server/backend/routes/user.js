const express = require("express");
const { verifyToken } = require("../middleware");
const User = require("../models/User");

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.post("/unsubscribe", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      { subscribed: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Unsubscribed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unsubscribing" });
  }
});

module.exports = router;
