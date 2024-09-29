const express = require("express");
const Queue = require("bull");
const { verifyToken, cacheMiddleware } = require("../middleware");
const Email = require("../models/Email");

const router = express.Router();
const emailQueue = new Queue("email-queue", process.env.REDIS_URL);

router.post("/send-bulk", verifyToken, async (req, res) => {
  try {
    const { subject, body } = req.body;
    const job = await emailQueue.add("bulk-email", { subject, body });
    res.status(202).json({ message: "Bulk email job queued", jobId: job.id });
  } catch (error) {
    res.status(500).json({ message: "Error queueing bulk email job" });
  }
});

router.post("/send-single", verifyToken, async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    const job = await emailQueue.add("single-email", { to, subject, body });
    res.status(202).json({ message: "Single email job queued", jobId: job.id });
  } catch (error) {
    res.status(500).json({ message: "Error queueing single email job" });
  }
});

router.get("/stats", verifyToken, cacheMiddleware(300), async (req, res) => {
  try {
    const totalEmails = await Email.countDocuments();
    const totalRecipients = await Email.aggregate([
      { $unwind: "$sentTo" },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);
    const recentEmails = await Email.find().sort({ createdAt: -1 }).limit(5);

    const stats = {
      totalEmails,
      totalRecipients: totalRecipients[0]?.count || 0,
      recentEmails,
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching email stats" });
  }
});

module.exports = router;
