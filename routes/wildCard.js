import express from "express";
import { wildcardRateLimiter } from "../ratelimiters/rateLimiters.js";
import logger from "../logging/winston.js";
const router = express.Router();

/**
 * Handling endpoint not found for all types of requests
 */
router.all("*", wildcardRateLimiter, (req, res) => {
  try {
    logger.info(`[${req.uuid} <> ${req.ip}] -> Endpoint not found, Returning response`);
    return res.status(500).json({ code: -1, msg: "Internal Server Error!" });
  } catch (error) {
    logger.error(`[${req.uuid} <> ${req.ip}] -> ${error}`);
    return res.status(500).json({ code: -1, msg: "Internal Server Error!" });
  }
});

export default router;
