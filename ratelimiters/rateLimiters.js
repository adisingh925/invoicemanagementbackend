import rateLimit from "express-rate-limit";
import logger from "../logging/winston.js";

export const pingRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (_req, res) {
    logger.info("Rate limit exceeded for ping for IP " + _req.ip);
    return res.status(429).json({
      code: -1,
      msg: "You are being rate limited. Please try again later.",
    });
  },
});

export const loginRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 24,
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (_req, res) {
    logger.info("Rate limit exceeded for login for IP " + _req.ip);
    return res.status(429).json({
      code: -1,
      msg: "You are being rate limited. Please try again later.",
    });
  },
});

export const signupRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (_req, res) {
    logger.info("Rate limit exceeded for signup for IP " + _req.ip);
    return res.status(429).json({
      code: -1,
      msg: "You are being rate limited. Please try again later.",
    });
  },
});

export const emailLinkRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (_req, res) {
    logger.info("Rate limit exceeded for email link for IP " + _req.ip);
    return res.status(429).json({
      code: -1,
      msg: "You are being rate limited. Please try again later.",
    });
  },
});

export const wildcardRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 1,
  standardHeaders: true,
  legacyHeaders: false,
  handler: function (_req, res) {
    logger.info("Rate limit exceeded for wildcard for IP " + _req.ip);
    return res.status(429).json({
      code: -1,
      msg: "You are being rate limited. Please try again later.",
    });
  },
});
