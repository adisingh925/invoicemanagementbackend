import pkg from "jsonwebtoken";
const { verify: _verify } = pkg;
import dotenv from "dotenv";
import logger from "../logging/winston";
dotenv.config();

const verifytoken = (req, res, next) => {
  logger.info("Verifying JWT token");

  try {
    const token = req.header("Authorization");
    if (!token) {
      logger.info("No token found");
      return res
        .status(401)
        .json({ msg: "Please authenticate using a valid token!", code: -2 });
    }

    logger.info("Token found, verifying token");
    const verify = _verify(token, process.env.JWT_SECRET);

    logger.info("Token verified successfully");
    req.id = verify.id;
    next();
  } catch (error) {
    logger.error(error);
    return res
      .status(401)
      .json({ msg: "Please authenticate using a valid token!", code: -2 });
  }
};

export default verifytoken;
