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
      logger.info(
        `[${req.uuid}] -> Validating login request -> [email = ${
          req.body.email
        }, password = ${req.body.password ? "****" : ""}]`
      );
      const result = validationResult(req);

      if (!result.isEmpty()) {
        logger.info(
          `[${
            req.uuid
          }] -> Validation failed, Returning response -> ${JSON.stringify(
            result.array()
          )}`
        );
        return res.status(400).json({ errors: result.array() });
      }

      logger.info(
        `[${req.uuid}] -> Login request validated successfully, Fetching user details`
      );

      const { email, password } = req.body;

      let user = await getUser(email);

      if (user == -1) {
        logger.info(`[${req.uuid}] -> User not found, Returning response`);
        return res.status(400).json({ msg: "User Not Exists!", code: -1 });
      }

      logger.info(
        `[${req.uuid}] -> User found, comparing password -> [userId = ${user.client_id}]`
      );

      const passwordCompare = await compare(password, user.password);

      if (!passwordCompare) {
        logger.info(`[${req.uuid}] -> Password mismatch, Returning response`);
        return res.status(400).json({ msg: "Invalid Credentials!", code: -1 });
      }

      logger.info(`[${req.uuid}] -> Password matched, generating token`);

      const tokenPayload = {
        id: user.client_id,
      };

      const authtoken = sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      });

      logger.info(
        `[${req.uuid}] -> Token generated successfully, Returning response -> [token = ${authtoken}]`
      );

      return res.status(200).json({
        msg: "login successful!",
        token: authtoken,
        code: 1,
      });
    } catch (error) {
      logger.error(`[${req.uuid}] -> ${error}`);
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

export default router;
