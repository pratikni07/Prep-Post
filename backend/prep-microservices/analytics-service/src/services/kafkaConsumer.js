const { Kafka } = require("kafkajs");
const Event = require("../models/eventModel");
const config = require("../config");

const kafka = new Kafka({
  clientId: "analytics-service",
  brokers: [config.kafkaBroker],
});

const consumer = kafka.consumer({ groupId: "analytics-group" });

const handleMessage = async (message) => {
  const event = JSON.parse(message.value);
  await Event.create(event);

  // Update real-time metrics
  if (event.eventType === "PAGE_VIEW") {
    await global.redisClient.incr("pageViews");
  }
  await global.redisClient.pfadd("activeUsers", event.userId);
};

const setupKafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "user-events", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      await handleMessage(message);
    },
  });
};

module.exports = { setupKafkaConsumer };
