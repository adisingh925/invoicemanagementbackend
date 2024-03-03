import { Router } from "express";
const router = Router();
import verifytoken from "../middleware/verifyToken.js";
import { getConfigsForClient } from "../database/db.js";

/**
 * @route GET /getConfigs
 */
router.get("/getConfigs", verifytoken, async (req, res) => {
  try {
    let configs = await getConfigsForClient(req.id);
    if (configs === -1) {
      return res
        .status(404)
        .json({ msg: "No configurations found for the client", code: -1 });
    }

    return res.status(200).json({
      msg: "Configurations fetched successfully!",
      data: configs,
      code: 1,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
  }
});

export default router;
