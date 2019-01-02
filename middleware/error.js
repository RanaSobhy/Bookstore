const { logger } = require("../handlers/log");
const moment = require("moment");

module.exports = function(err, req, res, next) {
  logger.log({
    level: "error",
    message: err.message,
    date: moment().format("ddd, MMM DD YYYY, kk:mm:ss")
  });

  res
    .status(500)
    .send({ status: "Error", response: "Something went Wrong..." });
};
