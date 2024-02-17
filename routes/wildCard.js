const express = require("express");
const router = express.Router();

/**
 * Handling endpoint not found
 */
router.all("*", (_req, res) => {
  return res.status(500).json({ code: -1, msg: "Internal Server Error!" });
});

module.exports = router;
