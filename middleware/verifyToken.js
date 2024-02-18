var jwt = require("jsonwebtoken");

const verifytoken = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ error: "Please authenticate using a valid token", code: -1 });
    }
    
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    req.email = verify.email;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Please authenticate using a valid token", code: -1 });
  }
};

module.exports = verifytoken;
