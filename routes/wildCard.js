import express from "express";
import { wildcardRateLimiter } from "../ratelimiters/rateLimiters.js";
import logger from "../logging/winston.js";
const router = express.Router();

/**
 * Handling endpoint not found for all types of requests
 */
router.all("*", wildcardRateLimiter, (_req, res) => {
  try {
    logger.info("Endpoint not found, Returning response");
    return res.status(500).json({ code: -1, msg: "Internal Server Error!" });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ code: -1, msg: "Internal Server Error!" });
  }
});

export default router;
