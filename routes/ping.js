const express = require("express");
const router = express.Router();

router.get("/", (_req, res) => {
  return res.status(200).json({ code: 1, msg: "Pong!" });
});

module.exports = router;
