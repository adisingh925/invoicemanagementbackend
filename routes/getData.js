import { Router } from "express";
import verifytoken from "../middleware/verifyToken.js";
import { fetchDataForCustomerInPages } from "../database/db.js";
const router = Router();

/**
 * @route GET /ping
 */
router.get("/getData", verifytoken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const customerId = parseInt(req.query.customerId) || req.id;

    const result = await fetchDataForCustomerInPages(
      customerId,
      page,
      limit,
      req.id + "_invoices"
    );

    if (result === -1) {
      return res.status(400).json({ msg: "No data found!", code: -1 });
    }

    return res.status(200).json({ code: 1, msg: "Data Found!", data: result });
  } catch (error) {
    return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
  }
});

export default router;
