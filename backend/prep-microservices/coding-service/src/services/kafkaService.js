const { Kafka } = require("kafkajs");
const config = require("../config");

const kafka = new Kafka({
  clientId: "coding-service",
  brokers: config.kafkaBrokers,
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "coding-service-group" });

async function initializeKafka() {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({
    topic: "submission-results",
    fromBeginning: true,
  });

  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const submissionResult = JSON.parse(message.value.toString());
      // Update submission status based on the result
      // This is where you'd update the submission in the database
      console.log("Received submission result:", submissionResult);
    },
  });
}

async function sendSubmissionToQueue(submission) {
  await producer.send({
    topic: "code-submissions",
    messages: [{ value: JSON.stringify(submission) }],
  });
}

module.exports = {
  initializeKafka,
  sendSubmissionToQueue,
};
