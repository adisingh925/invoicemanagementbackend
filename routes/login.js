import { Router } from "express";
const router = Router();
import bcrypt from "bcryptjs";
const { compare } = bcrypt;
import jwt from "jsonwebtoken";
const { sign } = jwt;
import { validationResult, body } from "express-validator";
import { getUser } from "../database/db.js";
import { loginRateLimiter } from "../ratelimiters/rateLimiters.js";
import dotenv from "dotenv";
import logger from "../logging/winston.js";
dotenv.config();

/**
 * @post /login
 */
router.post(
  "/login",
  loginRateLimiter,
  [
    body("email", "Enter a valid email").trim().isEmail().escape(),
    body("password", "Password must be atleast 6 characters")
      .isLength({ min: 6 })
      .escape(),
  ],
  async (req, res) => {
    try {
      logger.info("Validating login request");
      const result = validationResult(req);

      if (!result.isEmpty()) {
        logger.error("Validation failed, Returning response");
        return res.status(400).json({ errors: result.array() });
      }

      logger.info(
        "Login request validated successfully, Fetching user details"
      );

      const { email, password } = req.body;

      let user = await getUser(email);

      if (user == -1) {
        logger.info("User not found, Returning response");
        return res.status(400).json({ msg: "User Not Exists!", code: -1 });
      }

      logger.info("User found, comparing password");

      const passwordCompare = await compare(password, user.password);

      if (!passwordCompare) {
        logger.info("Password mismatch, Returning response");
        return res.status(400).json({ msg: "Invalid Credentials!", code: -1 });
      }

      logger.info("Password matched, generating token");

      const tokenPayload = {
        id: user.client_id,
      };

      const authtoken = sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      });

      logger.info("Token generated successfully, Returning response");

      return res.status(200).json({
        msg: "login successful!",
        token: authtoken,
        code: 1,
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

export default router;
