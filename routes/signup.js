const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const { validationResult, body } = require("express-validator");
const { getUser, createUser } = require("../database/db");

router.post(
  "/signup",
  [
    body("email", "Enter a valid email").trim().isEmail().escape(),
    body("password", "Password must be atleast 6 characters")
      .isLength({ min: 6 })
      .escape(),
  ],
  async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array(), code: -1 });
    }

    try {
      let user = await getUser(req.body.email);

      if (user != -1) {
        return res.status(400).json({
          msg: "Sorry!, A user with this email already exists!",
          code: -1,
        });
      }

      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(req.body.password, salt);

      await createUser(req.body.email, securePassword, "bucketName");

      const tokenPayload = {
        email: req.body.email,
      };

      const authtoken = jwt.sign(tokenPayload, process.env.JWT_SECRET);

      return res.status(201).json({
        msg: `Hello ${req.body.email}, Your account is created successfully!`,
        token: authtoken,
        code: 1,
      });
    } catch (error) {
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

module.exports = router;
