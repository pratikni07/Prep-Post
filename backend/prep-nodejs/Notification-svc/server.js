// notification-service/server.js (continued)
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_HOST });
const consumer = new kafka.Consumer(client, [{ topic: "notifications" }]);

consumer.on("message", async (message) => {
  const notificationData = JSON.parse(message.value);
  await createNotification(notificationData);
});

// Routes
app.use("/api/notifications", require("./routes/notifications"));

const PORT = process.env.PORT || 3004;
app.listen(PORT, () =>
  console.log(`Notification service running on port ${PORT}`)
);
