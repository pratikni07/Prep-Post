const { Kafka } = require("kafkajs");
const config = require("./index");
const logger = require("../utils/logger");
const { indexData } = require("../services/searchService");

const kafka = new Kafka({
  clientId: config.kafkaClientId,
  brokers: config.kafkaBrokers,
  ssl: true,
  sasl: {
    mechanism: "plain",
    username: config.kafkaUsername,
    password: config.kafkaPassword,
  },
});

const consumer = kafka.consumer({ groupId: config.kafkaGroupId });

const connectKafka = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({
      topics: [
        "user_updates",
        "quiz_updates",
        "coding_updates",
        "company_updates",
      ],
      fromBeginning: true,
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const payload = JSON.parse(message.value.toString());
        logger.info(`Received message from Kafka: ${JSON.stringify(payload)}`);
        await indexData(topic, payload);
      },
    });

    logger.info("Connected to Kafka");
  } catch (error) {
    logger.error("Failed to connect to Kafka", error);
  }
};

module.exports = { connectKafka, consumer };
