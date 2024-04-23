import { Router } from "express";
const router = Router();
import dotenv from "dotenv";
import logger from "../logging/winston.js";
import { validationResult, body, param } from "express-validator";
import {
  deleteManager,
  insertManager,
  readManager,
  updateManager,
} from "../database/db.js";
import verifytoken from "../middleware/verifyToken.js";
dotenv.config();

/**
 * @post /manager
 */
router.post(
  "/insert/manager/:gymId",
  verifytoken,
  [
    param("gymId", "Invalid gymId").isInt().toInt(),
    body("manager_name", "Name is required").trim().notEmpty().escape(),
    body("manager_phone_number", "Phone number must be a valid phone number")
      .trim()
      .isMobilePhone()
      .escape(),
    body("manager_email", "Email must be a valid email address")
      .trim()
      .isEmail()
      .escape(),
    body("manager_password", "Password must be atleast 6 characters")
      .isLength({ min: 6 })
      .escape(),
  ],
  async (req, res) => {
    try {
      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Insert Manager Request Received, Validating Body`
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
        manager_name,
        manager_phone_number,
        manager_email,
        manager_password,
      } = req.body;

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Validating Success, Inserting Data -> [gym_id = ${req.params.gymId}, manager_name = ${manager_name}, manager_phone_number = ${manager_phone_number}, manager_email = ${manager_email}]`
      );

      await insertManager(
        manager_name,
        manager_phone_number,
        manager_email,
        manager_password,
        req.id,
        req.params.gymId,
        req.uuid,
        req.ip
      );

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Manager Inserted Successfully!, Returning Response`
      );

      return res.status(200).json({
        msg: "Manager Inserted Successfully!",
        code: 1,
      });
    } catch (error) {
      logger.error(`[${req.uuid} <> ${req.ip}] -> ${error}`);
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

/**
 * @post /manager
 */
router.post(
  "/update/manager/:gymId",
  verifytoken,
  [
    param("gymId", "Invalid gymId").isInt().toInt(),
    body("manager_name", "Name is required").trim().notEmpty().escape(),
    body("manager_phone_number", "Phone number must be a valid phone number")
      .trim()
      .isMobilePhone()
      .escape(),
    body("manager_email", "Email must be a valid email address")
      .trim()
      .isEmail()
      .escape(),
    body("manager_password", "Password must be atleast 6 characters")
      .isLength({ min: 6 })
      .escape(),
  ],
  async (req, res) => {
    try {
      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Update Manager Request Received, Validating Body`
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

      const { manager_id, manager_name, manager_phone_number, manager_email, manager_password } =
        req.body;

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Validating Success, Updating Data -> [gym_id = ${req.params.gymId}, manager_id = ${manager_id}, manager_name = ${manager_name}, manager_phone_number = ${manager_phone_number}, manager_email = ${manager_email}]`
      );

      await updateManager(
        manager_id,
        manager_name,
        manager_phone_number,
        manager_email,
        manager_password,
        req.id,
        req.params.gymId,
        req.uuid,
        req.ip
      );

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Manager Updated Successfully, Returning Response!`
      );

      return res
        .status(200)
        .json({ msg: "Manager Updated Successfully!", code: 1 });
    } catch (error) {
      logger.error(`[${req.uuid} <> ${req.ip}] -> ${error}`);
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

/**
 * @post /manager
 */
router.get("/read/manager/:gymId", verifytoken, async (req, res) => {
  try {
    logger.info(
      `[${req.uuid} <> ${req.ip}] -> Read Manager Request Received, Proceeding to Fetch Data!`
    );

    let gymData = await readManager(req.params.gymId, req.id, req.uuid, req.ip);

    logger.info(
      `[${req.uuid} <> ${req.ip}] -> Manager Data Successfully Fetched, Returning Response!`
    );

    return res.status(200).json({
      msg: "Manager Data Fetched Successfully!",
      data: gymData,
      code: 1,
    });
  } catch (error) {
    logger.error(`[${req.uuid} <> ${req.ip}] -> ${error}`);
    return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
  }
});

/**
 * @post /manager
 */
router.post(
  "/delete/manager/:gymId",
  [
    param("gymId", "Invalid gymId").isInt().toInt(),
    body("manager_ids").isArray().withMessage("Manager IDs must be an array"),
    body("manager_ids.*")
      .isInt()
      .withMessage("Each Manager ID must be an integer"),
  ],
  verifytoken,
  async (req, res) => {
    try {
      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Delete Manager Request Received, Proceeding to Delete Data! -> [gym_id = ${req.params.gymId}, manager_ids = ${req.body.manager_ids}]`
      );

      await deleteManager(
        req.body.manager_ids,
        req.params.gymId,
        req.id,
        req.uuid,
        req.ip
      );

      logger.info(
        `[${req.uuid} <> ${req.ip}] -> Manager Data Successfully Deleted, Returning Response!`
      );

      return res.status(200).json({
        msg: "Manager Data Deleted Successfully!",
        code: 1,
      });
    } catch (error) {
      logger.error(`[${req.uuid} <> ${req.ip}] -> ${error}`);
      return res.status(500).json({ msg: "Internal Server Error!", code: -1 });
    }
  }
);

export default router;
