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
 * @route GET /ping
 */
router.get("/resetPassword/:token", verifyPasswordResetToken, (req, res) => {
  try {
    if (process.env.ENVIRONMENT === "development") {
      logger.info("Redirecting to development reset password page");
      res.redirect(
        `${process.env.WEBSITE_URL}/resetpassword/${req.params.token}`
      );
    } else {
      logger.info("Redirecting to reset password page");
      res.redirect(
        `https://master.d3qy4qha9z6m6l.amplifyapp.com/resetpassword/${req.params.token}`
      );
    }
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
  }
});

router.post(
  "/resetpassword/:token",
  verifyPasswordResetToken,
  async (req, res) => {
    try {
      logger.info("Updating password");

      const salt = await genSalt(10);
      const securePassword = await hash(req.body.password, salt);
      let response = updatePassword(req.id, securePassword);

      if (response === -1) {
        logger.info("Password Reset Failed!, Returning response");
        return res
          .status(400)
          .json({ msg: "Password Reset Failed!", code: -1 });
      }

      logger.info("Password Reset Successful!, Returning response");
      return res
        .status(200)
        .json({ msg: "Password Reset Successful!", code: 1 });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

export default router;
