import { Router } from "express";
const router = Router();
import { pingRateLimiter } from "../ratelimiters/rateLimiters.js";
import logger from "../logging/winston.js";

/**
 * @route GET /ping
 */
router.get("/", pingRateLimiter, (req, res) => {
  try {
    logger.info(`[${req.uuid}] -> Ping request received, Returning response`);
    return res.status(200).json({ code: 1, msg: "Pong!" });
  } catch (error) {
    logger.error(`[${req.uuid}] -> ${error}`);
    return res.status(500).json({ code: -1, msg: "Internal Server Error!" });
  } 
});

export default router;
