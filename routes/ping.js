import { Router } from "express";
const router = Router();
import { pingRateLimiter } from "../ratelimiters/rateLimiters.js";

/**
 * @route GET /ping
 */
router.get("/", pingRateLimiter, (_req, res) => {
  return res.status(200).json({ code: 1, msg: "Pong!" });
});

export default router;
