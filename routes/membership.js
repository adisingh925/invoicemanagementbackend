import { Router } from "express";
const router = Router();
import dotenv from "dotenv";
import logger from "../logging/winston.js";
import { validationResult, body } from "express-validator";
import {
  insertGym,
  insertMembership,
  readGym,
  updateGym,
  updateMembership,
} from "../database/db.js";
import verifytoken from "../middleware/verifyToken.js";
dotenv.config();

/**
 * @post /membership
 */
router.post(
  "/insert/membership",
  verifytoken,
  [
    body("gym_id", "Gym Id is required").trim().notEmpty().escape(),
    body("name", "Name is required").trim().notEmpty().escape(),
    body("price", "Price must be a number greater than or equal to 0")
      .trim()
      .isFloat({ min: 0 })
      .escape(),
    body("duration", "Duration must be a number between 0 and 12")
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

      const { gym_id, name, price, duration } = req.body;

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Validating Success, Inserting Data -> [name = ${name}, price = ${price}, duration = ${duration}]`
      );

      await insertMembership(
        name,
        price,
        duration,
        req.id,
        gym_id,
        req.uuid,
        req.ip
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
  "/update/membership",
  verifytoken,
  [
    body("gym_id", "Gym Id is required").trim().notEmpty().escape(),
    body("membership_id", "Membership Id is required")
      .trim()
      .notEmpty()
      .escape(),
    body("name", "Name is required").trim().notEmpty().escape(),
    body("price", "Price must be a number greater than or equal to 0")
      .trim()
      .isFloat({ min: 0 })
      .escape(),
    body("duration", "Duration must be a number between 0 and 12")
      .trim()
      .isInt({ min: 0, max: 12 })
      .escape(),
  ],
  async (req, res) => {
    try {
      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Update Membership request received, Validating Body`
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

      const { gym_id, membership_id, name, price, duration } = req.body;

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Validating Success, Updating Data -> [gym_id = ${gym_id}, membership_id = ${membership_id}, name = ${name}, price = ${price}, duration = ${duration}]`
      );

      await updateMembership(
        membership_id,
        name,
        price,
        duration,
        req.id,
        gym_id,
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
router.post("/read/membership", verifytoken, async (req, res) => {
  try {
    logger.info(
      `[${req.uuid} <> ${req.ip}] -> Read Membership Request Received`
    );

    let gymData = await readGym(req.id, req.uuid, req.ip);

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

export default router;
