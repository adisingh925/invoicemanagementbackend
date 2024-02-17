const express = require("express");
const router = express.Router();

/**
 * @route GET /ping
 */
router.get("/", (_req, res) => {
  return res.status(200).json({ code: 1, msg: "Pong!" });
});

module.exports = router;
