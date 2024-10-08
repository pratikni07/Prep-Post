const { client } = require("../config/elasticsearch");
const logger = require("../utils/logger");

const INDICES = {
  user: "users",
  quiz: "quizzes",
  coding: "coding_problems",
  company: "companies",
};

exports.search = async (query, type, page, limit) => {
  try {
    const index = type ? INDICES[type] : Object.values(INDICES);
    const from = (page - 1) * limit;

    const { body } = await client.search({
      index,
      body: {
        from,
        size: limit,
        query: {
          multi_match: {
            query,
            fields: ["name^2", "description", "content", "tags"],
            fuzziness: "AUTO",
          },
        },
        highlight: {
          fields: {
            name: {},
            description: {},
            content: {},
          },
        },
      },
    });

    const hits = body.hits.hits;
    const total = body.hits.total.value;

    const results = hits.map((hit) => ({
      id: hit._id,
      type: hit._index,
      score: hit._score,
      ...hit._source,
      highlights: hit.highlight,
    }));

    return {
      results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    logger.error("Error in search service", error);
    throw error;
  }
};

exports.indexData = async (type, data) => {
  try {
    const index = INDICES[type];
    if (!index) {
      throw new Error(`Invalid data type: ${type}`);
    }

    await client.index({
      index,
      body: data,
    });

    logger.info(`Indexed ${type} data: ${JSON.stringify(data)}`);
  } catch (error) {
    logger.error(`Error indexing ${type} data`, error);
    throw error;
  }
};
