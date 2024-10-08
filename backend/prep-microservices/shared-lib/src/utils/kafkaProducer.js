const { Kafka } = require("kafkajs");
const logger = require("./logger");

class KafkaProducer {
  constructor(brokers, clientId) {
    this.kafka = new Kafka({
      clientId,
      brokers,
      ssl: true,
      sasl: {
        mechanism: "plain",
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
      },
    });
    this.producer = this.kafka.producer();
  }

  async connect() {
    try {
      await this.producer.connect();
      logger.info("Connected to Kafka");
    } catch (error) {
      logger.error("Failed to connect to Kafka", error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await this.producer.disconnect();
      logger.info("Disconnected from Kafka");
    } catch (error) {
      logger.error("Failed to disconnect from Kafka", error);
      throw error;
    }
  }

  async sendMessage(topic, message, key = null) {
    try {
      const record = {
        topic,
        messages: [
          {
            key: key ? key : undefined,
            value: JSON.stringify(message),
          },
        ],
      };
      await this.producer.send(record);
      logger.info(`Message sent to topic ${topic}`);
    } catch (error) {
      logger.error(`Failed to send message to topic ${topic}`, error);
      throw error;
    }
  }
}

module.exports = KafkaProducer;
