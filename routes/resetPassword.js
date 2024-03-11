import { Router } from "express";
const router = Router();
import verifyPasswordResetToken from "../middleware/verifyPasswordResetToken.js";
import jwt from "jsonwebtoken";
import { updatePassword } from "../database/db.js";
const { sign } = jwt;
import pkg from "bcryptjs";
const { genSalt, hash } = pkg;

/**
 * @route GET /ping
 */
router.get("/resetPassword/:token", verifyPasswordResetToken, (req, res) => {
  try {
    res.redirect(`http://localhost:3000/reset-password/${req.params.token}`);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
  }
});

router.post(
  "/resetPassword/:token",
  verifyPasswordResetToken,
  async (req, res) => {
    try {
      const salt = await genSalt(10);
      const securePassword = await hash(req.body.password, salt);
      let response = updatePassword(req.id, securePassword);

      if (response === -1) {
        return res.status(400).json({ msg: "Password Reset Failed!", code: -1 });
      }

      return res.status(200).json({ msg: "Password Reset Successful!", code: 1 });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

export default router;
