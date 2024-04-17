import toobusy from "toobusy-js";
import logger from "../logging/winston.js";

const checkBusy = (req, res, next) => {
  try {
    if (toobusy()) {
      logger.warn(`${req.uuid} -> Server too busy, try again later!`);

      return res
        .status(503)
        .json({ code: -1, msg: "Server too busy, try again later!" });
    }

    next();
  } catch (error) {
    logger.error(req.uuid + " -> " + error);
    return res.status(500).json({ code: -1, msg: "Internal Server Error!" });
  }
};

export default checkBusy;
