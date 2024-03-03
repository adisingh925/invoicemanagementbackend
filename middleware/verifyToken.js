import pkg from "jsonwebtoken";
const { verify: _verify } = pkg;
import dotenv from "dotenv";
dotenv.config();

const verifytoken = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ msg: "Please authenticate using a valid token!", code: -2 });
    }

    const verify = _verify(token, process.env.JWT_SECRET);
    req.id = verify.id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ msg: "Please authenticate using a valid token!", code: -2 });
  }
};

export default verifytoken;
