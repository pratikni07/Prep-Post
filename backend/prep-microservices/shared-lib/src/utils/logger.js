const winston = require("winston");
const { format } = winston;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: process.env.SERVICE_NAME || "microservice" },
  transports: [
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, service, ...metadata }) => {
          let msg = `${timestamp} [${service}] ${level}: ${message}`;
          if (Object.keys(metadata).length > 0) {
            msg += JSON.stringify(metadata);
          }
          return msg;
        })
      ),
    }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

module.exports = logger;
