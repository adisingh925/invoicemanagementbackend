const express = require("express");
const router = express.Router();
const { createUserTable } = require("../database/db");

router.get("/createUserTable", async (_req, res) => {
  try {
    await createUserTable();
    return res
      .status(200)
      .json({ msg: "Table created successfully!", code: 1 });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
  }
});

module.exports = router;
