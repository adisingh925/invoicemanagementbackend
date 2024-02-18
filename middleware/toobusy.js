import toobusy from "toobusy-js";

const checkBusy = (_req, res, next) => {
  try {
    if (toobusy()) {
      return res
        .status(503)
        .json({ code: -1, msg: "Server too busy, try again later!" });
    }

    next();
  } catch (error) {
    return res.status(500).json({ code: -1, msg: "Internal Server Error!" });
  }
};

export default checkBusy;
