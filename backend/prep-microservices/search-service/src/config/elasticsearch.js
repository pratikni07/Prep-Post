const { Client } = require("@elastic/elasticsearch");
const config = require("./index");
const logger = require("../utils/logger");

const client = new Client({
  node: config.elasticsearchNode,
  auth: {
    username: config.elasticsearchUsername,
    password: config.elasticsearchPassword,
  },
  ssl: {
    rejectUnauthorized: false,
  },
});

const connectElasticsearch = async () => {
  try {
    const info = await client.info();
    logger.info(
      `Connected to Elasticsearch cluster named ${info.body.cluster_name}`
    );
  } catch (error) {
    logger.error("Failed to connect to Elasticsearch", error);
  }
};

module.exports = { client, connectElasticsearch };
