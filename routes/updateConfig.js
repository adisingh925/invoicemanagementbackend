import { Router } from "express";
const router = Router();
import verifytoken from "../middleware/verifyToken.js";
import { updateConfigForCustomer } from "../database/db.js";

/**
 * @route GET /getConfigs
 */
router.post("/updateConfig/:customer_id", verifytoken, async (req, res) => {
  try {
    let updateResult = await updateConfigForCustomer(
      req.id,
      req.params.customer_id,
      req.body.parsing_data
    );

    if (updateResult === -1) {
      return res
        .status(404)
        .json({ msg: "No configurations found for the client", code: -1 });
    }

    return res.status(200).json({
      msg: "Configurations updated successfully!",
      code: 1,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
  }
});

export default router;
