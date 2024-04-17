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
      logger.info(
        `[${req.uuid}] -> Validating signup request -> [email = ${
          req.body.email
        }, password = ${req.body.password ? "******" : ""}]`
      );

      const result = validationResult(req);

      if (!result.isEmpty()) {
        logger.warn(
          `[${
            req.uuid
          }] -> Validation failed, Returning response -> ${JSON.stringify(
            result.array()
          )}`
        );
        return res.status(400).json({ errors: result.array(), code: -1 });
      }

      logger.info(
        `[${req.uuid}] -> Signup request validated successfully, Fetching user details`
      );

      let user = await getUser(req.body.email);

      if (user != -1) {
        logger.info(
          `[${req.uuid}] -> User already exists, Returning response -> [userId = ${user.client_id}]`
        );
        return res.status(400).json({
          msg: "Sorry!, A user with this email already exists!",
          code: -1,
        });
      }

      logger.info(`[${req.uuid}] -> User not found, Creating user`);

      const salt = await genSalt(10);
      const securePassword = await hash(req.body.password, salt);
      let clientId = await createUser(req.body.email, securePassword);

      logger.info(
        `[${req.uuid}] -> User created successfully, Generating token -> [userId = ${clientId}]`
      );

      const tokenPayload = {
        id: clientId,
      };

      const authtoken = sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      });

      logger.info(
        `[${req.uuid}] -> Token generated successfully, Returning response -> [token = ${authtoken}]`
      );

      return res.status(201).json({
        msg: `Hello ${req.body.email}, Your account is created successfully!`,
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
