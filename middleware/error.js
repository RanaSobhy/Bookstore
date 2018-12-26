const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: "error.log",
      level: "error"
    }),
    new winston.transports.File({
      filename: "combined.log"
    })
  ]
});

module.exports = function(err, req, res, next) {
  logger.log({
    level: "error",
    message: err.message
  });

  res
    .status(500)
    .send({ status: "Error", response: "Something went Wrong..." });
};
