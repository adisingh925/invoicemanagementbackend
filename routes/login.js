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
      const result = validationResult(req);

      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      const { email, password } = req.body;

      let user = await getUser(email);

      if (user == -1) {
        return res.status(400).json({ msg: "User Not Exists!", code: -1 });
      }

      const passwordCompare = await compare(password, user.password);

      if (!passwordCompare) {
        return res.status(400).json({ msg: "Invalid Credentials!", code: -1 });
      }

      const tokenPayload = {
        id: user.client_id,
      };

      const authtoken = sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      });

      return res.status(200).json({
        msg: "login successful!",
        token: authtoken,
        code: 1,
      });
    } catch (error) {
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

export default router;
