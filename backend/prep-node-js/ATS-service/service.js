const app = require("./app");
const logger = require("./utils/logger");

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  logger.info(`Server running on port ${port}`);
});
