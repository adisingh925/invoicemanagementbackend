import { Router } from "express";
const router = Router();
import verifyPasswordResetToken from "../middleware/verifyPasswordResetToken.js";
import jwt from "jsonwebtoken";
import { updatePassword } from "../database/db.js";
const { sign } = jwt;
import pkg from "bcryptjs";
const { genSalt, hash } = pkg;
import dotenv from "dotenv";
import logger from "../logging/winston.js";
dotenv.config();

/**
 * @route GET /resetPassword
 */
router.get("/resetPassword/:token", verifyPasswordResetToken, (req, res) => {
  try {
    if (process.env.ENVIRONMENT === "development") {
      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Redirecting to development reset password page -> [password reset url = ${process.env.WEBSITE_URL}/resetpassword/${req.params.token}, password reset token = ${req.params.token}, userId = ${req.id}]`
      );
      res.redirect(
        `${process.env.WEBSITE_URL}/resetpassword/${req.params.token}`
      );
    } else {
      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Redirecting to production reset password page -> [password reset url = ${process.env.WEBSITE_URL}/resetpassword/${req.params.token}, password reset token = ${req.params.token}, userId = ${req.id}]`
      );
      res.redirect(
        `${process.env.WEBSITE_URL}/resetpassword/${req.params.token}`
      );
    }
  } catch (error) {
    logger.error(`${req.uuid} -> ${error}`);
    return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
  }
});

router.post(
  "/resetpassword/:token",
  verifyPasswordResetToken,
  async (req, res) => {
    try {
      logger.info(
        `${req.uuid} -> Updating password -> [userId = ${req.id}], token = ${req.params.token}`
      );

      const salt = await genSalt(10);
      const securePassword = await hash(req.body.password, salt);
      let response = updatePassword(req.id, securePassword);

      if (response === -1) {
        logger.info(
          `[${req.uuid} <> ${req.ip}] -> Password Reset Failed!, Returning response`
        );
        return res
          .status(400)
          .json({ msg: "Password Reset Failed!", code: -1 });
      }

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Password Reset Successful!, Returning response`
      );
      return res
        .status(200)
        .json({ msg: "Password Reset Successful!", code: 1 });
    } catch (error) {
      logger.error(`[${req.uuid} <> ${req.ip}] -> ${error}`);
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

export default router;
