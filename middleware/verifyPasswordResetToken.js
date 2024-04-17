import pkg from "jsonwebtoken";
const { verify: _verify } = pkg;
import dotenv from "dotenv";
import { checkPasswordUpdateTime } from "../database/db.js";
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";
import logger from "../logging/winston.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const verifyPasswordResetToken = async (req, res, next) => {
  try {
    logger.info(
      `[${req.uuid}] -> Entering Password Reset Token Verification Middleware`
    );

    const token = req.params.token;

    if (!token) {
      logger.info(`[${req.uuid}] -> No token found, Returning response`);
      if (req.method === "GET") {
        return res.sendFile(
          path.join(__dirname, "../templates/invalid_password_reset_token.html")
        );
      } else {
        return res.status(400).json({ msg: "Invalid Token!", code: -1 });
      }
    }

    logger.info(
      `[${req.uuid}] -> Token found, Verifying token -> [token = ${token}]`
    );
    const verify = _verify(token, process.env.JWT_PASSWORD_RESET_SECRET);

    logger.info(
      `[${req.uuid}] -> Token verified, Checking password update time`
    );
    let passwordUpdateTime = await checkPasswordUpdateTime(verify.id);

    if (passwordUpdateTime === -1) {
      logger.info(
        `[${req.uuid}] -> Password update time not found, Returning response`
      );
      if (req.method === "GET") {
        return res.sendFile(
          path.join(__dirname, "../templates/invalid_password_reset_token.html")
        );
      } else {
        return res.status(400).json({ msg: "Invalid Token!", code: -1 });
      }
    }

    logger.info(
      `[${req.uuid}] -> Password update time found, Comparing token creation time`
    );
    const tokenCreationTime = new Date(verify.iat * 1000);
    let passwordUpdateTimeDate = new Date(
      passwordUpdateTime.password_update_time
    );

    if (tokenCreationTime < passwordUpdateTimeDate) {
      logger.info(
        `[${req.uuid}] -> Token is older than password update time, Returning response`
      );
      if (req.method === "GET") {
        return res.sendFile(
          path.join(__dirname, "../templates/invalid_password_reset_token.html")
        );
      } else {
        return res.status(400).json({ msg: "Invalid Token!", code: -1 });
      }
    }

    logger.info(
      `[${req.uuid}] -> Token is not older than password update time, Proceeding to next middleware`
    );
    req.id = verify.id;
    next();
  } catch (error) {
    logger.error(`[${req.uuid}] -> ${error}`);
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
