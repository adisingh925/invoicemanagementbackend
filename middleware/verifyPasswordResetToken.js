import pkg from "jsonwebtoken";
const { verify: _verify } = pkg;
import dotenv from "dotenv";
import { checkPasswordUpdateTime } from "../database/db.js";
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const verifyPasswordResetToken = async (req, res, next) => {
  try {
    const token = req.params.token;

    if (!token) {
      console.log("No token found");
      if (req.method === "GET") {
        return res.sendFile(
          path.join(__dirname, "../templates/invalid_password_reset_token.html")
        );
      } else {
        return res.status(400).json({ msg: "Invalid Token!", code: -1 });
      }
    }

    const verify = _verify(token, process.env.JWT_PASSWORD_RESET_SECRET);

    let passwordUpdateTime = await checkPasswordUpdateTime(verify.id);

    if (passwordUpdateTime === -1) {
      console.log("User not found");
      if (req.method === "GET") {
        return res.sendFile(
          path.join(__dirname, "../templates/invalid_password_reset_token.html")
        );
      } else {
        return res.status(400).json({ msg: "Invalid Token!", code: -1 });
      }
    }

    const tokenCreationTime = new Date(verify.iat * 1000);
    let passwordUpdateTimeDate = new Date(passwordUpdateTime.password_update_time);

    if (tokenCreationTime < passwordUpdateTimeDate) {
      console.log("Token is older than password update time");
      if (req.method === "GET") {
        return res.sendFile(
          path.join(__dirname, "../templates/invalid_password_reset_token.html")
        );
      } else {
        return res.status(400).json({ msg: "Invalid Token!", code: -1 });
      }
    }

    req.id = verify.id;
    next();
  } catch (error) {
    console.log(error.message);
    if (req.method === "GET") {
      return res.sendFile(
        path.join(__dirname, "../templates/invalid_password_reset_token.html")
      );
    } else {
      return res.status(500).json({ msg: "Invalid Token!", code: -1 });
    }
  }
};

export default verifyPasswordResetToken;
