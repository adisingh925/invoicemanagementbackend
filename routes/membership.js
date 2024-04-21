import { Router } from "express";
const router = Router();
import dotenv from "dotenv";
import logger from "../logging/winston.js";
import { validationResult, body, param } from "express-validator";
import {
  deleteMembership,
  insertMembership,
  readMembership,
  updateMembership,
} from "../database/db.js";
import verifytoken from "../middleware/verifyToken.js";
dotenv.config();

/**
 * @post /membership
 */
router.post(
  "/insert/membership/:gymId",
  verifytoken,
  [
    param("gymId", "Invalid gymId").isInt().toInt(),
    body("membership_name", "Name is required").trim().notEmpty().escape(),
    body(
      "membership_price",
      "Price must be a number greater than or equal to 0"
    )
      .trim()
      .isFloat({ min: 0 })
      .escape(),
    body(
      "membership_duration_months",
      "Duration must be a number between 0 and 12"
    )
      .trim()
      .isInt({ min: 0, max: 12 })
      .escape(),
  ],
  async (req, res) => {
    try {
      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Insert Membership Request Received, Validating Body`
      );

      const result = validationResult(req);

      if (!result.isEmpty()) {
        logger.info(
          `[${req.uuid} <> ${
            req.ip
          }] -> Validation Failed, Returning Response -> ${JSON.stringify(
            result.array()
          )}`
        );
        return res.status(400).json({ errors: result.array() });
      }

      const { membership_name, membership_price, membership_duration_months } =
        req.body;

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Validating Success, Inserting Data -> [gym_id = ${req.params.gymId}, membership_name = ${membership_name}, membership_price = ${membership_price}, membership_duration_months = ${membership_duration_months}]`
      );

      await insertMembership(
        membership_name,
        membership_price,
        membership_duration_months,
        req.id,
        req.params.gymId,
        req.uuid,
        req.ip
      );

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Membership Inserted Successfully!, Returning Response`
      );

      return res.status(200).json({
        msg: "Membership Inserted Successfully!",
        code: 1,
      });
    } catch (error) {
      logger.error(`[${req.uuid} <> ${req.ip}] -> ${error}`);
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

/**
 * @post /membership
 */
router.post(
  "/update/membership/:gymId",
  verifytoken,
  [
    param("gymId", "Invalid gymId").isInt().toInt(),
    body("membership_id", "Membership Id is required")
      .trim()
      .notEmpty()
      .escape(),
    body("membership_name", "Name is required").trim().notEmpty().escape(),
    body(
      "membership_price",
      "Price must be a number greater than or equal to 0"
    )
      .trim()
      .isFloat({ min: 0 })
      .escape(),
    body(
      "membership_duration_months",
      "Duration must be a number between 0 and 12"
    )
      .trim()
      .isInt({ min: 0, max: 12 })
      .escape(),
  ],
  async (req, res) => {
    try {
      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Update Membership Request Received, Validating Body`
      );

      const result = validationResult(req);

      if (!result.isEmpty()) {
        logger.info(
          `[${req.uuid} <> ${
            req.ip
          }] -> Validation Failed, Returning Response -> ${JSON.stringify(
            result.array()
          )}`
        );
        return res.status(400).json({ errors: result.array() });
      }

      const {
        membership_id,
        membership_name,
        membership_price,
        membership_duration_months,
      } = req.body;

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Validating Success, Updating Data -> [gym_id = ${req.params.gymId}, membership_id = ${membership_id}, membership_name = ${membership_name}, membership_price = ${membership_price}, membership_duration_months = ${membership_duration_months}]`
      );

      await updateMembership(
        membership_id,
        membership_name,
        membership_price,
        membership_duration_months,
        req.id,
        req.params.gymId,
        req.uuid,
        req.ip
      );

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Membership Updated Successfully, Returning Response!`
      );

      return res
        .status(200)
        .json({ msg: "Membership Updated Successfully!", code: 1 });
    } catch (error) {
      logger.error(`[${req.uuid} <> ${req.ip}] -> ${error}`);
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

/**
 * @post /membership
 */
router.get("/read/membership/:gymId", verifytoken, async (req, res) => {
  try {
    logger.info(
      `[${req.uuid} <> ${req.ip}] -> Read Membership Request Received, Proceeding to Fetch Data!`
    );

    let gymData = await readMembership(
      req.params.gymId,
      req.id,
      req.uuid,
      req.ip
    );

    logger.info(
      `[${req.uuid} <> ${req.ip}] -> Membership Data Successfully Fetched, Returning Response!`
    );

    return res.status(200).json({
      msg: "Membership Data Fetched Successfully!",
      data: gymData,
      code: 1,
    });
  } catch (error) {
    logger.error(`[${req.uuid} <> ${req.ip}] -> ${error}`);
    return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
  }
});

/**
 * @post /membership
 */
router.post(
  "/delete/membership/:gymId",
  [
    param("gymId", "Invalid gymId").isInt().toInt(),
    body("membership_ids")
      .isArray()
      .withMessage("Membership IDs must be an array"),
    body("membership_ids.*")
      .isInt()
      .withMessage("Each membership ID must be an integer"),
  ],
  verifytoken,
  async (req, res) => {
    try {
      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Delete Memberships Request Received, Proceeding to Delete Data! -> [gym_id = ${req.params.gymId}, membership_ids = ${req.body.membership_ids}]`
      );

      await deleteMembership(
        req.body.membership_ids,
        req.params.gymId,
        req.id,
        req.uuid,
        req.ip
      );

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Membership Data Successfully Deleted, Returning Response!`
      );

      return res.status(200).json({
        msg: "Membership Data Deleted Successfully!",
        code: 1,
      });
    } catch (error) {
      logger.error(`[${req.uuid} <> ${req.ip}] -> ${error}`);
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

export default router;
