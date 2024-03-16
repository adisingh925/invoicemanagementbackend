import { Router } from "express";
const router = Router();
import jwt from "jsonwebtoken";
import { getUser } from "../database/db.js";
import { sendEmail } from "../mailing/nodemailer.js";
import dotenv from "dotenv";
dotenv.config();

/**
 * @route GET /sendResetLink
 */
router.get("/sendResetLink/:email", async (req, res) => {
  try {
    let user = await getUser(req.params.email);

    if (user === -1) {
      return res.status(200).json({ code: 1, msg: "Reset link sent!" });
    }

    let payload = {
      id: user.client_id,
    };

    let token = jwt.sign(payload, process.env.JWT_PASSWORD_RESET_SECRET, {
      expiresIn: process.env.RESET_PASSWORD_EXPIRE_TIME,
    });

    sendEmail(
      [`${req.params.email}`],
      {
        email: req.params.email,
        resetLink: `${process.env.SERVER_URL}/auth/resetPassword/${token}`,
        expireTime: "5",
        companyName: "Blivix",
        year: "2021",
      },
      "Password Reset Request",
      "templates/passwordResetTemplate.html",
      "no-reply",
      "Blivix Support"
    );

    return res.status(200).json({ code: 1, msg: "Reset link sent!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
  }
});

export default router;
