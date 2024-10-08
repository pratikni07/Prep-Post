const { Kafka } = require("kafkajs");
const config = require("./index");
const logger = require("../utils/logger");

const kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBrokers,
});

const consumer = kafka.consumer({ groupId: config.kafkaGroupId });

const connectKafka = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "notifications", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const notification = JSON.parse(message.value.toString());
        // Process the notification
        logger.info(`Received notification: ${JSON.stringify(notification)}`);
        // Here you would call your notification service to send the actual notification
      },
    });

    logger.info("Connected to Kafka");
  } catch (error) {
    logger.error("Failed to connect to Kafka", error);
  }
};

module.exports = { connectKafka, consumer };
