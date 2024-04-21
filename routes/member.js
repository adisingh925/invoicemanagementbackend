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
 * @post /member
 */
router.post(
  "/insert/member/:gymId",
  verifytoken,
  [
    param("gymId", "Invalid gymId").isInt().toInt(),
    body("member_name", "Name is required").trim().notEmpty().escape(),
    body("member_email", "Invalid email address").trim().isEmail().escape(),
    body("member_phone_number", "Invalid phone number")
      .trim()
      .isMobilePhone()
      .escape(),
    body("member_membership_type", "Invalid membership type").isInt().toInt(),
  ],
  async (req, res) => {
    try {
      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Insert Member Request Received, Validating Body`
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
        member_name,
        member_email,
        member_phone_number,
        member_membership_type,
      } = req.body;

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Validating Success, Inserting Data -> [gym_id = ${req.params.gymId}, member_name = ${member_name}, member_email = ${member_email}, member_phone_number = ${member_phone_number}, member_membership_type = ${member_membership_type}]`
      );

      await insertMembership(
        member_name,
        member_email,
        member_phone_number,
        member_membership_type,
        req.id,
        req.params.gymId,
        req.uuid,
        req.ip
      );

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Member Inserted Successfully!, Returning Response`
      );

      return res.status(200).json({
        msg: "Member Inserted Successfully!",
        code: 1,
      });
    } catch (error) {
      logger.error(`[${req.uuid} <> ${req.ip}] -> ${error}`);
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

/**
 * @post /member
 */
router.post(
  "/update/member/:gymId",
  verifytoken,
  [
    param("gymId", "Invalid gymId").isInt().toInt(),
    body("member_id", "Invalid member id").isInt().toInt(),
    body("member_name", "Name is required").trim().notEmpty().escape(),
    body("member_email", "Invalid email address").trim().isEmail().escape(),
    body("member_phone_number", "Invalid phone number")
      .trim()
      .isMobilePhone()
      .escape(),
    body("member_membership_type", "Invalid membership type").isInt().toInt(),
  ],
  async (req, res) => {
    try {
      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Update Member Request Received, Validating Body`
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
        member_id,
        member_name,
        member_email,
        member_phone_number,
        member_membership_type,
      } = req.body;

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Validating Success, Updating Data -> [gym_id = ${req.params.gymId}, member_id = ${member_id}, member_name = ${member_name}, member_email = ${member_email}, member_phone_number = ${member_phone_number}, member_membership_type = ${member_membership_type}]`
      );

      await updateMembership(
        member_id,
        member_name,
        member_email,
        member_phone_number,
        member_membership_type,
        req.id,
        req.params.gymId,
        req.uuid,
        req.ip
      );

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Member Updated Successfully, Returning Response!`
      );

      return res
        .status(200)
        .json({ msg: "Member Updated Successfully!", code: 1 });
    } catch (error) {
      logger.error(`[${req.uuid} <> ${req.ip}] -> ${error}`);
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

/**
 * @post /member
 */
router.get("/read/member/:gymId", verifytoken, async (req, res) => {
  try {
    logger.info(
      `[${req.uuid} <> ${req.ip}] -> Read Member Request Received, Proceeding to Fetch Data!`
    );

    let gymData = await readMembership(
      req.params.gymId,
      req.id,
      req.uuid,
      req.ip
    );

    logger.info(
      `[${req.uuid} <> ${req.ip}] -> Member Data Successfully Fetched, Returning Response!`
    );

    return res.status(200).json({
      msg: "Member Data Fetched Successfully!",
      data: gymData,
      code: 1,
    });
  } catch (error) {
    logger.error(`[${req.uuid} <> ${req.ip}] -> ${error}`);
    return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
  }
});

/**
 * @post /member
 */
router.post(
  "/delete/member/:gymId",
  [
    param("gymId", "Invalid gymId").isInt().toInt(),
    body("member_ids")
      .isArray()
      .withMessage("Member IDs must be an array"),
    body("member_ids.*")
      .isInt()
      .withMessage("Each Member ID must be an integer"),
  ],
  verifytoken,
  async (req, res) => {
    try {
      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Delete Member Request Received, Proceeding to Delete Data! -> [gym_id = ${req.params.gymId}, member_ids = ${req.body.member_ids}]`
      );

      await deleteMembership(
        req.body.member_ids,
        req.params.gymId,
        req.id,
        req.uuid,
        req.ip
      );

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Member Data Successfully Deleted, Returning Response!`
      );

      return res.status(200).json({
        msg: "Member Data Deleted Successfully!",
        code: 1,
      });
    } catch (error) {
      logger.error(`[${req.uuid} <> ${req.ip}] -> ${error}`);
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

export default router;
