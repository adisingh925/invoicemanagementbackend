import toobusy from "toobusy-js";
import logger from "../logging/winston.js";

const checkBusy = (_req, res, next) => {
  logger.info("Checking server busy status");
  try {
    if (toobusy()) {
      logger.warn("Server too busy, try again later!");

      return res
        .status(503)
        .json({ code: -1, msg: "Server too busy, try again later!" });
    }

    logger.info("Server is not busy");
    next();
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ code: -1, msg: "Internal Server Error!" });
  }
};

export default checkBusy;
