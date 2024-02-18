import { Router } from "express";
const router = Router();
import { createUserTable } from "../database/db.js";

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

export default router;
