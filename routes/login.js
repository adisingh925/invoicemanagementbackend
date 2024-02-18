const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { validationResult, body } = require("express-validator");
const { getUser } = require("../database/db");
const { loginRateLimiter } = require("../ratelimiters/rateLimiters");

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

      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        return res.status(400).json({ msg: "Invalid Credentials!", code: -1 });
      }

      const tokenPayload = {
        email: req.body.email,
      };

      const authtoken = jwt.sign(tokenPayload, process.env.JWT_SECRET);

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

module.exports = router;
