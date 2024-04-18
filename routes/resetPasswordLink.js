import { Router } from "express";
const router = Router();
import jwt from "jsonwebtoken";
import { getUser } from "../database/db.js";
import { sendEmail } from "../mailing/nodemailer.js";
import dotenv from "dotenv";
import { emailLinkRateLimiter } from "../ratelimiters/rateLimiters.js";
import logger from "../logging/winston.js";
dotenv.config();

/**
 * @route GET /sendResetLink
 */
router.get("/sendResetLink/:email", emailLinkRateLimiter, async (req, res) => {
  try {
    logger.info(
      `[${req.uuid} <> ${req.ip}] -> Password Reset Link Requested, verifying user -> [email = ${req.params.email}]`
    );

    let user = await getUser(req.params.email, req.uuid, req.ip);

    if (user === -1) {
      logger.info(
        `[${req.uuid} <> ${req.ip}] -> User not found, Returning response`
      );
      return res.status(200).json({ code: 1, msg: "Reset link sent!" });
    }

    logger.info(
      `[${req.uuid} <> ${req.ip}] -> User found, Generating password reset token -> [userId = ${user.client_id}]`
    );

    let payload = {
      id: user.client_id,
    };

    let token = jwt.sign(payload, process.env.JWT_PASSWORD_RESET_SECRET, {
      expiresIn: process.env.RESET_PASSWORD_EXPIRE_TIME,
    });

    logger.info(
      `[${req.uuid} <> ${req.ip}] -> Token generated, Sending reset link -> [password reset link = ${process.env.SERVER_URL}/auth/resetpassword/${token}]`
    );

    sendEmail(
      [`${req.params.email}`],
      {
        email: req.params.email,
        resetLink: `${process.env.SERVER_URL}/auth/resetpassword/${token}`,
        expireTime: "5",
        companyName: "Blivix",
        year: "2021",
      },
      "Password Reset Request",
      "templates/passwordResetTemplate.html",
      "no-reply",
      "Blivix Support",
      req
    );

    logger.info(
      `[${req.uuid} <> ${req.ip}] -> Reset link sent!, Returning response`
    );
    return res.status(200).json({ code: 1, msg: "Reset link sent!" });
  } catch (error) {
    logger.error(`[${req.uuid} <> ${req.ip}] -> ${error}`);
    return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
  }
});

export default router;
