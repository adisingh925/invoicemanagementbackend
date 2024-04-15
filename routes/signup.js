import { Router } from "express";
const router = Router();
import pkg from "bcryptjs";
const { genSalt, hash } = pkg;
import jwt from "jsonwebtoken";
const { sign } = jwt;
import { validationResult, body } from "express-validator";
import { getUser, createUser } from "../database/db.js";
import { signupRateLimiter } from "../ratelimiters/rateLimiters.js";
import dotenv from "dotenv";
import logger from "../logging/winston.js";
dotenv.config();

router.post(
  "/signup",
  signupRateLimiter,
  [
    body("email", "Enter a valid email").trim().isEmail().escape(),
    body("password", "Password must be atleast 6 characters")
      .isLength({ min: 6 })
      .escape(),
  ],
  async (req, res) => {
    try {
      logger.info("Validating signup request");

      const result = validationResult(req);

      if (!result.isEmpty()) {
        logger.error("Validation failed, Returning response");
        return res.status(400).json({ errors: result.array(), code: -1 });
      }

      logger.info(
        "Signup request validated successfully, Fetching user details"
      );

      let user = await getUser(req.body.email);

      if (user != -1) {
        logger.info("User already exists, Returning response");
        return res.status(400).json({
          msg: "Sorry!, A user with this email already exists!",
          code: -1,
        });
      }

      logger.info("User not found, Creating user");

      const salt = await genSalt(10);
      const securePassword = await hash(req.body.password, salt);
      let clientId = await createUser(req.body.email, securePassword);

      logger.info("User created successfully, Generating token");

      const tokenPayload = {
        id: clientId,
      };

      const authtoken = sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      });

      logger.info("Token generated successfully, Returning response");

      return res.status(201).json({
        msg: `Hello ${req.body.email}, Your account is created successfully!`,
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
