import express from "express";
import { wildcardRateLimiter } from "../ratelimiters/rateLimiters.js";
const router = express.Router();

/**
 * Handling endpoint not found for all types of requests
 */
router.all("*", wildcardRateLimiter, (_req, res) => {
  return res.status(500).json({ code: -1, msg: "Internal Server Error!" });
});

export default router;
